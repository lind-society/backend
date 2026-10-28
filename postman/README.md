# Postman collection

`lind-society.postman_collection.json` — 181 requests covering every HTTP route
in the Main API (`:3000`) and the External Gateway (`:3002`).

## Import

Postman → **Import** → drop the JSON file in. Everything is one collection with
a folder per controller.

## Environment

The collection ships with working defaults, so it runs without an environment
at all. Import one when you need to switch between local, staging and
production without editing the collection.

`lind-society.local.postman_environment.json` is generated alongside the
collection and points at localhost, reading the ports out of `.env`. Import it
the same way, then pick it in the environment dropdown (top right).

Secret values are blank by default. To fill them from your local `.env`:

```bash
node scripts/generate-postman-collection.mjs --with-secrets
```

That writes real tokens into the file, so it is gitignored — an environment
file is the thing people export and paste into a chat.

| Variable | Where it comes from |
| --- | --- |
| `baseUrl`, `gatewayUrl`, `apiVersion` | `HOST`, `MAIN_PORT`, `EXTERNAL_GATEWAY_PORT`, `API_VERSION` |
| `adminIdentifier`, `adminPassword` | your admin account |
| `accessToken` | written automatically by the login request |
| `bookingToken` | last path segment of a booking link (`/booking/<token>`) |
| `callbackToken` | `XENDIT_WEBHOOK_VERIFICATION_TOKEN` |
| `whatsappToken` | `WHATSAPP_WEBHOOK_TOKEN` |

An environment beats collection variables when a value differs per machine or
per stage; keep shared defaults in the collection and overrides in the
environment. Postman resolves environment over collection.

## Use it

1. Pick the environment, or adjust `baseUrl` in the collection variables.
2. Set `adminPassword`, then run **Getting started → Admin login**. Its test
   script writes `accessToken`, and all 127 admin requests read it from there.
3. Guest-facing booking routes authenticate with `bookingToken` instead.
4. Gateway callbacks (`/payments/*/callback`) use `callbackToken`; the WhatsApp
   inbound webhook uses `whatsappToken`.

## Regenerating

The collection is generated from the controllers, not maintained by hand:

```bash
node scripts/generate-postman-collection.mjs
```

Run it after adding or changing an endpoint. Editing the JSON directly works
until the next regeneration overwrites it.

## What it can and cannot know

Request bodies are skeletons built from the DTO classes — field names and types
are real, and enum fields are filled with a valid value. Anything the generator
could not infer is `null`, deliberately: an obvious placeholder is safer than a
plausible-looking value that is wrong.

Path parameters are left empty. Query parameters that the handler asks for by
name are enabled and marked required; ones derived from a query DTO are added
disabled, so you can switch on only what you need.
