import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const BACKEND_ROOT = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);

/** Reads backend/.env into a plain object (process.env wins when set). */
export function readEnv() {
  const values = {};

  try {
    const raw = readFileSync(join(BACKEND_ROOT, '.env'), 'utf8');

    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);

      if (match) {
        values[match[1]] = match[2].replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    // No .env: rely on the process environment alone.
  }

  return { ...values, ...process.env };
}

/** `--key value` / `--flag` arguments. */
export function parseArgs(argv) {
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
