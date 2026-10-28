/**
 * Marks a booking payment as paid by replaying the gateway's success callback.
 *
 * Lets the guest flow be finished in the browser without a Xendit account: the
 * callback endpoint only checks `x-callback-token`, so we can send it ourselves.
 *
 *   node scripts/mark-payment-paid.mjs --booking <uuid> --token <booking-link-token>
 */
import { readFileSync } from 'node:fs';

const API = process.env.API_URL ?? 'http://localhost:3000/api/v1';

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
};

const bookingId = arg('booking');
const linkToken = arg('token');
const channel = arg('channel') ?? 'BCA';

if (!bookingId || !linkToken) {
  console.error('usage: node scripts/mark-payment-paid.mjs --booking <uuid> --token <link-token> [--channel BCA]');
  process.exit(1);
}

const env = readFileSync(new URL('../.env', import.meta.url), 'utf8');
const readEnv = (key) => {
  const line = env.split(/\r?\n/).find((l) => l.startsWith(`${key}=`));
  return line ? line.slice(key.length + 1).replace(/^"|"$/g, '').trim() : '';
};

const callbackToken = readEnv('XENDIT_WEBHOOK_VERIFICATION_TOKEN');
if (!callbackToken) {
  console.error('XENDIT_WEBHOOK_VERIFICATION_TOKEN is empty in backend/.env');
  process.exit(1);
}

// 1. Create the payment record the guest would have created by picking a channel.
const createRes = await fetch(`${API}/bookings/${bookingId}/payments`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-booking-token': linkToken },
  body: JSON.stringify({ paymentMethod: 'bank_transfer', paymentChannel: channel }),
});
const created = await createRes.json();

if (!createRes.ok) {
  console.error('could not create the payment:', created.message ?? createRes.status);
  process.exit(1);
}

const paymentId = created.data.id;
const amount = Number(created.data.amount);
console.log(`payment ${paymentId} created (${channel}, ${amount})`);

// 2. Replay the gateway callback that reports it as settled.
const hookRes = await fetch(`${API}/payments/request/callback`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-callback-token': callbackToken },
  body: JSON.stringify({
    event: 'payment.succeeded',
    business_id: 'manual-test',
    created: new Date().toISOString(),
    api_version: '2022-07-31',
    data: {
      payment_id: `manual-${Date.now()}`,
      reference_id: `${paymentId}_manual`,
      payment_request_id: `manual-req-${Date.now()}`,
      request_amount: amount,
      channel_code: channel,
      currency: 'IDR',
      country: 'ID',
      status: 'SUCCEEDED',
    },
  }),
});

console.log(`callback sent (HTTP ${hookRes.status})`);

// 3. Read back what the guest page will now show.
const publicRes = await fetch(`${API}/bookings/public/${linkToken}`);
const publicBody = await publicRes.json();
console.log('booking status :', publicBody.data?.status);
console.log('payment status :', publicBody.data?.payments?.at(-1)?.status);
