#!/usr/bin/env node
/**
 * Creates the first admin account. `POST /auth/register` needs an existing
 * admin, so a fresh database has no other way in.
 *
 *   pnpm admin:create --email admin@lind.test --password Admin12345
 *
 * Options (all optional):
 *   --name "Lind Admin"   --username admin   --phone 6281234567890
 *
 * Connects with the DB_* values from backend/.env and hashes the password the
 * same way the API does (bcrypt, 10 rounds). Safe to re-run: an existing email
 * is left untouched.
 */

import bcrypt from 'bcrypt';
import pg from 'pg';
import { parseArgs, readEnv } from './lib/env.mjs';

const env = readEnv();
const args = parseArgs(process.argv.slice(2));

const email = args.email;
const password = args.password;

if (!email || !password) {
  console.error(
    'Usage: pnpm admin:create --email <email> --password <password>',
  );
  process.exit(1);
}

if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
  console.error(
    'Password must be at least 8 characters with one uppercase letter and one number.',
  );
  process.exit(1);
}

const client = new pg.Client({
  host: env.DB_HOST,
  port: Number(env.DB_PORT ?? 5432),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

await client.connect();

try {
  const existing = await client.query(
    'SELECT id FROM admins WHERE email = $1 AND deleted_at IS NULL',
    [email],
  );

  if (existing.rowCount > 0) {
    console.log(`Admin ${email} already exists, nothing to do.`);
  } else {
    await client.query(
      `INSERT INTO admins (name, username, email, password, phone_number)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        args.name ?? 'Lind Admin',
        args.username ?? email.split('@')[0],
        email,
        await bcrypt.hash(password, 10),
        args.phone ?? '6281234567890',
      ],
    );
    console.log(`Created admin ${email}.`);
  }
} finally {
  await client.end();
}
