import { readEnv } from './env.mjs';

const env = readEnv();

export const API = (
  process.env.API_URL ??
  `http://localhost:${env.MAIN_PORT ?? 4782}/api/${env.API_VERSION ?? 'v1'}`
).replace(/\/$/, '');

let token = null;

export async function login(identifier, password) {
  const response = await request(
    'POST',
    '/auth/login',
    { identifier, password },
    false,
  );

  token = response.data.accessToken;
}

/** Calls the API and returns the parsed body; throws with the validation detail on failure. */
export async function request(method, path, body, auth = true) {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  let json;

  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!response.ok) {
    throw new Error(
      `${method} ${path} -> ${response.status}\n${JSON.stringify(json.data ?? json, null, 2)}`,
    );
  }

  return json;
}
