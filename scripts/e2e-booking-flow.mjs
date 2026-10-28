#!/usr/bin/env node
/**
 * Walks one booking through the entire flow, end to end, against a running
 * stack — inquiry, the owner's WhatsApp reply, payment, and confirmation.
 *
 *   node scripts/e2e-booking-flow.mjs --identifier admin@lind.test --password secret
 *
 * Options:
 *   --identifier / --password   admin login (or ADMIN_IDENTIFIER / ADMIN_PASSWORD)
 *   --villa <uuid>              book a specific villa instead of auto-picking
 *   --reply "NOT AVAILABLE"     test the refusal path (default: "AVAILABLE <code>")
 *   --no-code                   send the reply without the booking code, to see
 *                               the "which booking do you mean?" branch
 *   --skip-payment              stop after the owner's reply
 *   --customer-email <email>    guest email (default: throwaway @lind.test)
 *   --customer-phone <number>   guest phone without country code
 *   --api http://localhost:3000/api/v1
 *
 * The owner's reply is injected onto the same RabbitMQ queue the WhatsApp
 * microservice publishes to, so it exercises the real listener rather than
 * calling the service directly. The payment is driven by posting a Xendit-shaped
 * webhook at the callback endpoint using the verification token from `.env`,
 * which means no real gateway account, card or e-wallet is needed.
 *
 * Nothing here is mocked inside the app: every assertion is read back out of the
 * API afterwards.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BACKEND_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// ---------------------------------------------------------------- environment

function readEnvFile() {
  try {
    const raw = readFileSync(join(BACKEND_ROOT, '.env'), 'utf8');
    const values = {};

    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);

      if (match) {
        values[match[1]] = match[2].replace(/^["']|["']$/g, '');
      }
    }

    return values;
  } catch {
    return {};
  }
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    if (!argv[index].startsWith('--')) continue;

    const key = argv[index].slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      index += 1;
    }
  }

  return args;
}

const env = readEnvFile();
const args = parseArgs(process.argv.slice(2));

const API = (
  args.api ??
  process.env.API_BASE_URL ??
  `http://localhost:${env.MAIN_PORT || 3000}/api/${env.API_VERSION || 'v1'}`
).replace(/\/$/, '');

const RABBITMQ_URL =
  args['rabbitmq-url'] ?? process.env.RABBITMQ_URL ?? env.RABBITMQ_URL;
const CALLBACK_TOKEN =
  process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN ??
  env.XENDIT_WEBHOOK_VERIFICATION_TOKEN;
const WHATSAPP_WEBHOOK_TOKEN =
  process.env.WHATSAPP_WEBHOOK_TOKEN ?? env.WHATSAPP_WEBHOOK_TOKEN;

const IDENTIFIER = args.identifier ?? process.env.ADMIN_IDENTIFIER;
const PASSWORD = args.password ?? process.env.ADMIN_PASSWORD;

// The guest's own details. Default to a throwaway address so repeat runs don't
// mail anyone; pass --customer-email to actually receive the confirmation.
const CUSTOMER_EMAIL = args['customer-email'] ?? `e2e+${Date.now()}@lind.test`;
const CUSTOMER_PHONE = args['customer-phone'] ?? '81200000001';

const WHATSAPP_INBOUND_QUEUE = 'whatsapp_inbound_queue';
const WHATSAPP_INBOUND_MESSAGE = 'whatsapp.inbound.message';

// ------------------------------------------------------------------- reporting

const results = [];
let stepNumber = 0;

const paint = {
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  dim: (text) => `\x1b[2m${text}\x1b[0m`,
};

function heading(title) {
  stepNumber += 1;
  console.log(`\n${paint.bold(`${stepNumber}. ${title}`)}`);
}

function pass(message) {
  results.push({ ok: true, message });
  console.log(`   ${paint.green('PASS')}  ${message}`);
}

function fail(message) {
  results.push({ ok: false, message });
  console.log(`   ${paint.red('FAIL')}  ${message}`);
}

function warn(message) {
  console.log(`   ${paint.yellow('WARN')}  ${message}`);
}

function info(message) {
  console.log(`   ${paint.dim(message)}`);
}

function expect(condition, message) {
  if (condition) {
    pass(message);
  } else {
    fail(message);
  }

  return condition;
}

// ------------------------------------------------------------------- http

async function request(method, path, { token, bookingToken, body, headers } = {}) {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(bookingToken ? { 'x-booking-token': bookingToken } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await response.text();
  let payload = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  return { status: response.status, ok: response.ok, payload };
}

function describeError(result) {
  const message = result.payload?.message ?? result.payload?.error ?? result.payload;

  return `HTTP ${result.status} ${
    typeof message === 'string' ? message : JSON.stringify(message)
  }`;
}

/** Polls until `predicate` holds, because the status changes run on events. */
async function waitFor(label, predicate, { attempts = 20, delayMs = 500 } = {}) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const value = await predicate();

    if (value) {
      return value;
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  info(`gave up waiting for ${label} after ${attempts} attempts`);

  return null;
}

// ------------------------------------------------------------------- helpers

function bookingCode(bookingId) {
  return bookingId.replace(/-/g, '').slice(0, 8).toUpperCase();
}

/**
 * Normalises a list response.
 *
 * The HAL interceptor rewrites a bare array into an index-keyed object with a
 * `link` sibling — `{"0": {...}, "1": {...}, "link": "…"}` — so endpoints that
 * return a plain array cannot simply be iterated. Paginated endpoints nest the
 * real array under `data` instead.
 */
function toList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (!payload || typeof payload !== 'object') return [];

  return Object.entries(payload)
    .filter(([key]) => /^\d+$/.test(key))
    .map(([, value]) => value);
}

function isoDay(offsetDays) {
  const date = new Date();

  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offsetDays);

  return date.toISOString();
}

/**
 * A stay window picked at random, far enough out to be free.
 *
 * A booking parked at `waiting_for_payment` genuinely occupies its dates, so a
 * fixed window makes the second run collide with the first — correct behaviour,
 * but useless for a test you want to repeat. Pass `--days-ahead` to pin the
 * window when you need a specific one.
 */
function stayWindow() {
  const startOffset =
    args['days-ahead'] !== undefined
      ? Number(args['days-ahead'])
      : 30 + Math.floor(Math.random() * 900);

  return {
    checkInDate: isoDay(startOffset),
    checkOutDate: isoDay(startOffset + 3),
  };
}

/**
 * Publishes onto the inbound queue in the envelope Nest's RabbitMQ transport
 * expects: `{ pattern, data }`, with no `id` — that is what marks it an event
 * rather than a request awaiting a reply.
 */
async function publishOwnerReply(phoneNumber, message) {
  const amqp = await import('amqplib');
  const connection = await amqp.connect(RABBITMQ_URL);

  try {
    const channel = await connection.createChannel();

    await channel.assertQueue(WHATSAPP_INBOUND_QUEUE, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': `${WHATSAPP_INBOUND_QUEUE}_dlx`,
        'x-dead-letter-routing-key': `${WHATSAPP_INBOUND_QUEUE}_failed`,
      },
    });

    channel.sendToQueue(
      WHATSAPP_INBOUND_QUEUE,
      Buffer.from(
        JSON.stringify({
          pattern: WHATSAPP_INBOUND_MESSAGE,
          data: {
            phoneNumber,
            message,
            messageId: `e2e-${Date.now()}`,
            receivedAt: new Date().toISOString(),
          },
        }),
      ),
      { persistent: true },
    );

    await channel.close();
  } finally {
    await connection.close();
  }
}

// ------------------------------------------------------------------- the run

async function main() {
  console.log(paint.bold('\nLind Society — booking flow, end to end'));
  info(`api: ${API}`);

  // 1 ---------------------------------------------------------------- login
  heading('Admin login');

  if (!IDENTIFIER || !PASSWORD) {
    fail(
      'no admin credentials — pass --identifier and --password (or set ADMIN_IDENTIFIER / ADMIN_PASSWORD)',
    );

    return summarise();
  }

  const login = await request('POST', '/auth/login', {
    body: { identifier: IDENTIFIER, password: PASSWORD },
  });

  if (!expect(login.ok, `logged in as ${IDENTIFIER}`)) {
    info(describeError(login));

    return summarise();
  }

  const token = login.payload?.data?.accessToken;

  if (!expect(Boolean(token), 'received an access token')) {
    return summarise();
  }

  // 2 ------------------------------------------------------- pick a villa
  heading('Find a villa whose owner has a phone number');

  const villa = await pickVilla(token);

  if (!villa) {
    fail('no villa with an owner phone number — seed one first');

    return summarise();
  }

  const ownerPhone = `${villa.owner.phoneCountryCode}${villa.owner.phoneNumber}`.replace(
    /\D/g,
    '',
  );

  pass(`using "${villa.name}" (owner ${villa.owner.name}, ${ownerPhone})`);

  // 3 ------------------------------------------------------ create booking
  heading('Guest sends an inquiry (public, no login)');

  const { checkInDate, checkOutDate } = stayWindow();

  const created = await request('POST', `/villas/${villa.id}/book`, {
    body: {
      type: 'villa',
      villaId: villa.id,
      totalGuest: 2,
      checkInDate,
      checkOutDate,
      customer: {
        name: 'E2E Guest',
        email: CUSTOMER_EMAIL,
        phoneCountryCode: '+62',
        phoneNumber: CUSTOMER_PHONE,
      },
    },
  });

  if (!expect(created.status === 201, 'booking created (201)')) {
    info(describeError(created));

    return summarise();
  }

  const booking = created.payload.data;
  const code = bookingCode(booking.id);

  expect(booking.status === 'requested', 'booking starts at "requested"');
  expect(
    Boolean(booking.bookingLink),
    'create response carries the guest booking link',
  );

  const accessToken = booking.bookingLink?.split('/').pop();

  info(`booking  ${booking.id}`);
  info(`code     ${code}`);
  info(`link     ${booking.bookingLink}`);
  info(`amount   ${booking.totalAmount} (priced by the server, not the browser)`);

  // The amount is recomputed server-side, so it must be a real number.
  expect(Number(booking.totalAmount) > 0, 'server priced the booking itself');

  // 4 ------------------------------------------------- owner replies on WA
  // The booking code is appended unless the reply already quotes one. An owner
  // with several bookings waiting gets an "which one do you mean?" reply rather
  // than a guess, which is correct but makes a code-less test non-deterministic.
  // Pass --no-code to exercise that branch on purpose.
  const providedReply = typeof args.reply === 'string' ? args.reply : null;
  const replyText = providedReply
    ? args['no-code'] || /\b[0-9a-f]{8}\b/i.test(providedReply)
      ? providedReply
      : `${providedReply} ${code}`
    : `AVAILABLE ${code}`;

  const saysAvailable = !/not\s*available|tidak|unavailable/i.test(replyText);

  heading(`Owner replies on WhatsApp: "${replyText}"`);

  const expectedStatus = saysAvailable ? 'waiting_for_payment' : 'negotiation';

  // Three ways in, most faithful first. The first two both run the real
  // owner-reply logic; only the last one bypasses it.
  let replyDelivered = false;

  if (RABBITMQ_URL) {
    try {
      await publishOwnerReply(ownerPhone, replyText);
      pass(`published onto ${WHATSAPP_INBOUND_QUEUE} as the microservice would`);
      replyDelivered = true;
    } catch (error) {
      info(`RabbitMQ not reachable (${error.message || 'connection refused'})`);
    }
  } else {
    info('RABBITMQ_URL is not set');
  }

  if (!replyDelivered && WHATSAPP_WEBHOOK_TOKEN) {
    const rejected = await request('POST', '/bookings/whatsapp/inbound', {
      headers: { 'x-whatsapp-token': 'wrong-token-of-the-wrong-length' },
      body: { phoneNumber: ownerPhone, message: replyText },
    });

    expect(
      rejected.status === 403,
      'the inbound webhook rejects a wrong shared secret',
    );

    const delivered = await request('POST', '/bookings/whatsapp/inbound', {
      headers: { 'x-whatsapp-token': WHATSAPP_WEBHOOK_TOKEN },
      body: { phoneNumber: ownerPhone, message: replyText },
    });

    if (delivered.ok) {
      pass(
        `delivered over the inbound webhook — outcome: ${delivered.payload?.outcome}`,
      );

      // With no code and more than one booking waiting, refusing to guess is
      // the correct answer — the whole point of the fail-closed design.
      if (args['no-code']) {
        expect(
          ['ambiguous', 'applied'].includes(delivered.payload?.outcome),
          'a code-less reply is either unambiguous or politely refused',
        );

        if (delivered.payload?.outcome === 'ambiguous') {
          const unchanged = await request('GET', `/bookings/${booking.id}`, {
            token,
          });

          expect(
            unchanged.payload?.data?.status === 'requested',
            'an ambiguous reply leaves the booking untouched',
          );

          return summarise();
        }
      } else {
        expect(
          delivered.payload?.outcome === 'applied',
          'the reply was matched to this booking and applied',
        );
      }

      replyDelivered = true;
    } else {
      info(describeError(delivered));
    }
  }

  if (!replyDelivered) {
    warn(
      'falling back to the admin dashboard route — the owner-reply logic was NOT exercised',
    );
    info(
      'set WHATSAPP_WEBHOOK_TOKEN in .env, or start RabbitMQ, to test the real path',
    );

    const patched = await request('PATCH', `/bookings/${booking.id}`, {
      token,
      body: { status: expectedStatus },
    });

    expect(patched.ok, `admin moved the booking to "${expectedStatus}"`);
  }

  const moved = await waitFor(`booking to reach "${expectedStatus}"`, async () => {
    const current = await request('GET', `/bookings/${booking.id}`, { token });

    return current.payload?.data?.status === expectedStatus
      ? current.payload.data
      : null;
  });

  if (
    !expect(
      Boolean(moved),
      `the reply moved the booking to "${expectedStatus}"`,
    )
  ) {
    const current = await request('GET', `/bookings/${booking.id}`, { token });

    info(`still at "${current.payload?.data?.status}"`);
    info(
      'check the backend log for [BookingOwnerReplyService] — an owner phone that does not match is the usual cause',
    );

    return summarise();
  }

  if (!saysAvailable) {
    info('refusal path verified: the booking is back with the admin, link still alive');

    return summarise();
  }

  // 5 ------------------------------------------------------ the guest link
  heading('Guest opens their link');

  const publicView = await request('GET', `/bookings/public/${accessToken}`);

  expect(publicView.ok, 'the tokenised link resolves without any login');
  expect(
    publicView.payload?.data?.status === 'waiting_for_payment',
    'the guest sees the booking as ready for payment',
  );
  expect(
    publicView.payload?.data?.accessToken === undefined,
    'the public payload never echoes the token back',
  );

  const wrongToken = await request(
    'GET',
    '/bookings/public/0000000000000000000000000000000000000000000000000000000000000000',
  );

  expect(
    wrongToken.status === 404,
    'a wrong token is a plain 404, revealing nothing',
  );

  // The link is only useful if the page behind it actually renders. Skipped
  // rather than failed when the frontend is not running — the API is the thing
  // under test here.
  await checkGuestPage(booking.bookingLink);

  if (args['skip-payment']) {
    return summarise();
  }

  // 6 ------------------------------------------------------------- payment
  heading('Guest starts a payment with their link token');

  const payment = await request('POST', `/bookings/${booking.id}/payments`, {
    bookingToken: accessToken,
    body: { paymentMethod: 'bank_transfer', paymentChannel: 'BCA' },
  });

  if (!expect(payment.status === 201, 'payment record created with the link token alone')) {
    info(describeError(payment));

    return summarise();
  }

  const bookingPayment = payment.payload.data;

  expect(
    Number(bookingPayment.amount) === Number(booking.totalAmount),
    'the payment is for the full outstanding amount',
  );

  const unauthorised = await request('POST', `/bookings/${booking.id}/payments`, {
    bookingToken: 'not-the-right-token',
    body: { paymentMethod: 'bank_transfer' },
  });

  expect(
    unauthorised.status === 404 || unauthorised.status === 401,
    'a wrong booking token cannot start a payment',
  );

  // 7 -------------------------------------------------- gateway says paid
  heading('Payment gateway reports the money as received');

  if (!CALLBACK_TOKEN) {
    fail('XENDIT_WEBHOOK_VERIFICATION_TOKEN not found in .env — cannot fake the callback');

    return summarise();
  }

  const rejected = await request('POST', '/payments/request/callback', {
    headers: { 'x-callback-token': 'wrong-token' },
    body: { event: 'payment.succeeded', data: {} },
  });

  expect(rejected.status === 403, 'a webhook with the wrong token is rejected');

  const callback = await request('POST', '/payments/request/callback', {
    headers: { 'x-callback-token': CALLBACK_TOKEN },
    body: {
      // Xendit's real payment events are payment.capture / payment.authorization
      // / payment.failure — https://docs.xendit.co/apidocs/payment-webhook-notification
      event: 'payment.capture',
      business_id: 'e2e-business',
      created: new Date().toISOString(),
      api_version: env.XENDIT_API_VERSION || '2022-07-31',
      data: {
        payment_id: `e2e-payment-${Date.now()}`,
        reference_id: `${bookingPayment.id}_e2e`,
        payment_request_id: `e2e-request-${Date.now()}`,
        request_amount: Number(bookingPayment.amount),
        channel_code: 'BCA',
        currency: 'IDR',
        country: 'ID',
        status: 'SUCCEEDED',
      },
    },
  });

  expect(callback.ok, 'the signed webhook is accepted');

  // 8 ------------------------------------------------------- confirmation
  heading('Booking lands as confirmed');

  const confirmed = await waitFor('booking to reach "booked"', async () => {
    const current = await request('GET', `/bookings/${booking.id}`, { token });

    return current.payload?.data?.status === 'booked' ? current.payload.data : null;
  });

  expect(Boolean(confirmed), 'the paid webhook moved the booking to "booked"');

  const payments = await request('GET', `/bookings/${booking.id}/payments`, {
    bookingToken: accessToken,
  });

  const paid = toList(payments.payload?.data).find(
    (item) => item.id === bookingPayment.id,
  );

  expect(paid?.status === 'paid', 'the payment record is marked paid');

  const closed = await request('GET', `/bookings/public/${accessToken}`);

  expect(
    closed.ok,
    'the link still works after payment, so the guest keeps their confirmation',
  );

  info(`booking ${booking.id} finished at "${confirmed?.status}"`);

  return summarise();
}

/**
 * Opens the guest link the way the guest would, to catch the case where the
 * backend hands out a URL that the frontend has no route for.
 */
async function checkGuestPage(bookingLink) {
  if (!bookingLink) {
    return;
  }

  try {
    const response = await fetch(bookingLink, { redirect: 'follow' });

    expect(
      response.status === 200,
      `the guest page at ${bookingLink} renders (HTTP ${response.status})`,
    );
  } catch (error) {
    warn(
      `frontend not reachable at ${bookingLink} (${error.message}) — page check skipped`,
    );
  }
}

/** Finds a villa whose owner has a phone number we can reply from. */
async function pickVilla(token) {
  if (typeof args.villa === 'string') {
    const detail = await request('GET', `/villas/${args.villa}`, { token });
    const villa = detail.payload?.data;

    return villa?.owner?.phoneNumber ? villa : null;
  }

  const list = await request('GET', '/villas?limit=25', { token });

  for (const item of toList(list.payload?.data)) {
    const detail = await request('GET', `/villas/${item.id}`, { token });
    const villa = detail.payload?.data;

    if (villa?.owner?.phoneNumber && villa?.owner?.phoneCountryCode) {
      return villa;
    }
  }

  return null;
}

function summarise() {
  const failed = results.filter((result) => !result.ok);

  console.log(`\n${paint.bold('Summary')}`);
  console.log(
    `   ${results.length - failed.length} passed, ${failed.length} failed\n`,
  );

  for (const failure of failed) {
    console.log(`   ${paint.red('•')} ${failure.message}`);
  }

  process.exitCode = failed.length ? 1 : 0;
}

main().catch((error) => {
  console.error(`\n${paint.red('crashed')} ${error.stack ?? error.message}`);
  process.exitCode = 1;
});
