#!/usr/bin/env node
/**
 * Seeds the payment channels a guest can pick from.
 *
 *   node scripts/seed-payment-channels.mjs --identifier admin@… --password …
 *
 * Codes are Xendit's — they are sent straight through as `channelCode` when a
 * payment request is created, so they have to match what the gateway expects.
 *
 * Seeded through the API rather than SQL so the same validation an admin would
 * hit applies here too. Re-running is safe: existing codes are skipped.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BACKEND_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const CHANNELS = [
  // Virtual accounts — the default way to pay in Indonesia.
  { code: 'BCA', name: 'BCA Virtual Account', type: 'virtual_account' },
  { code: 'BNI', name: 'BNI Virtual Account', type: 'virtual_account' },
  { code: 'BRI', name: 'BRI Virtual Account', type: 'virtual_account' },
  { code: 'MANDIRI', name: 'Mandiri Virtual Account', type: 'virtual_account' },
  { code: 'PERMATA', name: 'Permata Virtual Account', type: 'virtual_account' },

  { code: 'QRIS', name: 'QRIS', type: 'qris' },

  { code: 'OVO', name: 'OVO', type: 'e_wallet' },
  { code: 'DANA', name: 'DANA', type: 'e_wallet' },
  { code: 'SHOPEEPAY', name: 'ShopeePay', type: 'e_wallet' },
  { code: 'LINKAJA', name: 'LinkAja', type: 'e_wallet' },

  { code: 'CARDS', name: 'Credit / Debit Card', type: 'card' },
];

function readEnvFile() {
  try {
    const raw = readFileSync(join(BACKEND_ROOT, '.env'), 'utf8');
    const values = {};

    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match) values[match[1]] = match[2].replace(/^["']|["']$/g, '');
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
  `http://localhost:${env.MAIN_PORT || 3000}/api/${env.API_VERSION || 'v1'}`
).replace(/\/$/, '');

const IDENTIFIER = args.identifier ?? process.env.ADMIN_IDENTIFIER;
const PASSWORD = args.password ?? process.env.ADMIN_PASSWORD;

/** The HAL interceptor turns bare arrays into index-keyed objects. */
function toList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (!payload || typeof payload !== 'object') return [];

  return Object.entries(payload)
    .filter(([key]) => /^\d+$/.test(key))
    .map(([, value]) => value);
}

async function main() {
  if (!IDENTIFIER || !PASSWORD) {
    console.error('pass --identifier and --password (admin account)');
    process.exitCode = 1;

    return;
  }

  const login = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ identifier: IDENTIFIER, password: PASSWORD }),
  });

  if (!login.ok) {
    console.error(`login failed: HTTP ${login.status}`);
    process.exitCode = 1;

    return;
  }

  const token = (await login.json())?.data?.accessToken;
  const headers = {
    'content-type': 'application/json',
    authorization: `Bearer ${token}`,
  };

  const existingResponse = await fetch(`${API}/payment-channels?limit=100`);
  const existing = new Set(
    toList((await existingResponse.json())?.data).map((channel) => channel.code),
  );

  let created = 0;
  let skipped = 0;

  for (const channel of CHANNELS) {
    if (existing.has(channel.code)) {
      skipped += 1;
      continue;
    }

    const response = await fetch(`${API}/payment-channels`, {
      method: 'POST',
      headers,
      body: JSON.stringify(channel),
    });

    if (response.ok) {
      created += 1;
      console.log(`  + ${channel.code.padEnd(10)} ${channel.name}`);
    } else {
      const body = await response.text();
      console.log(`  ! ${channel.code.padEnd(10)} HTTP ${response.status} ${body}`);
    }
  }

  console.log(`\n${created} created, ${skipped} already present`);
}

main().catch((error) => {
  console.error(error.stack ?? error.message);
  process.exitCode = 1;
});
