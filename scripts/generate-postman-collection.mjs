#!/usr/bin/env node
/**
 * Builds a Postman collection by reading the NestJS controllers.
 *
 *   node scripts/generate-postman-collection.mjs
 *
 * Options:
 *   --out <path>     where to write (default: postman/lind-society.postman_collection.json)
 *   --with-secrets   fill the environment file with the local values from `.env`
 *                    instead of leaving them blank. Convenience for local work
 *                    only — the file then holds real tokens, so it stays out of
 *                    git and must not be shared.
 *
 * Also writes `postman/lind-society.local.postman_environment.json`, a Postman
 * environment pointing at localhost.
 *
 * There is no Swagger in this project, so the routes are read straight from the
 * source: the `@Controller` prefix, the HTTP verb decorators, the guards, and
 * the DTO named on `@Body()`. That means the collection is regenerated rather
 * than hand-maintained — run it again after adding an endpoint instead of
 * editing the JSON, which drifts the moment anyone forgets.
 *
 * What it deliberately does not do: invent example values that look like real
 * data. A body skeleton is derived from the DTO's own fields and types, and
 * anything it cannot infer is left as an obvious placeholder.
 */

import { readdirSync, readFileSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const BACKEND_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APPS_ROOT = join(BACKEND_ROOT, 'apps');

const args = process.argv.slice(2);
const outArgIndex = args.indexOf('--out');
const OUT_PATH = join(
  BACKEND_ROOT,
  outArgIndex >= 0 && args[outArgIndex + 1]
    ? args[outArgIndex + 1]
    : 'postman/lind-society.postman_collection.json',
);

// Each HTTP app mounts its own prefix; the microservice apps (mail, whatsapp)
// speak RabbitMQ only and have no routes to collect.
const APPS = {
  main: { baseUrlVar: 'baseUrl', prefix: 'api/{{apiVersion}}' },
  'external-gateway': {
    baseUrlVar: 'gatewayUrl',
    prefix: 'external-gateway/{{apiVersion}}',
  },
};

// --------------------------------------------------------------- file walking

function walk(dir, matcher, found = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);

    if (statSync(full).isDirectory()) {
      walk(full, matcher, found);
    } else if (matcher(full)) {
      found.push(full);
    }
  }

  return found;
}

function findControllers() {
  // `villa-policy-controller.ts` breaks the `.controller.ts` convention every
  // other file follows, and matching only the convention silently dropped five
  // live routes.
  return walk(
    APPS_ROOT,
    (file) =>
      /[.-]controller\.ts$/.test(file) && !file.endsWith('.spec.ts'),
  );
}

/**
 * Removes comments before parsing.
 *
 * Several controllers keep large commented-out blocks of deprecated routes at
 * the bottom. Read literally they produce endpoints that do not exist, which is
 * worse than missing ones — someone would go looking for why they 404.
 */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, ' '))
    .replace(/^\s*\/\/.*$/gm, '');
}

function findDtoFile(dtoName) {
  // DTO classes live all over the tree; the cheapest reliable lookup is a scan
  // for the declaration itself, cached across the run.
  if (dtoFileCache.has(dtoName)) return dtoFileCache.get(dtoName);

  const declaration = new RegExp(`export\\s+class\\s+${dtoName}\\b`);

  for (const file of allSourceFiles) {
    const source = readFileSync(file, 'utf8');

    if (declaration.test(source)) {
      dtoFileCache.set(dtoName, { file, source });

      return { file, source };
    }
  }

  dtoFileCache.set(dtoName, null);

  return null;
}

const dtoFileCache = new Map();
const allSourceFiles = walk(
  APPS_ROOT,
  (file) => file.endsWith('.ts') && !file.endsWith('.spec.ts'),
).concat(walk(join(BACKEND_ROOT, 'libs'), (file) => file.endsWith('.ts')));

// ------------------------------------------------------------------- parsing

const HTTP_DECORATORS = ['Get', 'Post', 'Patch', 'Put', 'Delete', 'Head', 'Options'];

/**
 * Pulls the string literal out of a decorator like `@Controller('villas')`.
 * Returns '' for a bare `@Get()`, which Nest treats as the parent path.
 */
function decoratorPath(decorator) {
  const match = decorator.match(/\(\s*['"`]([^'"`]*)['"`]/);

  return match ? match[1] : '';
}

function joinPath(...segments) {
  return segments
    .flatMap((segment) => String(segment ?? '').split('/'))
    .filter((segment) => segment !== '')
    .join('/');
}

/**
 * Reads a controller file into { prefix, guards, routes[] }.
 *
 * Decorators are collected as the lines immediately above a declaration, which
 * is how they are written everywhere in this codebase. A controller carrying no
 * HTTP verbs at all (a RabbitMQ `@EventPattern` listener) yields no routes and
 * is dropped by the caller.
 */
function parseController(file) {
  const source = stripComments(readFileSync(file, 'utf8'));
  const lines = source.split(/\r?\n/);

  const controllerIndex = lines.findIndex((line) =>
    /^\s*@Controller\s*\(/.test(line),
  );

  if (controllerIndex === -1) return null;

  const prefix = decoratorPath(lines[controllerIndex]);

  // Class-level decorators sit in the block ending at `export class`.
  const classLineIndex = lines.findIndex((line) => /^\s*export\s+class\s/.test(line));
  const classBlock = lines.slice(0, classLineIndex).join('\n');

  const controllerGuards = [...classBlock.matchAll(/@UseGuards\(([^)]*)\)/g)]
    .map((match) => match[1])
    .join(',');
  const controllerIsPublic = /@Public\(\)/.test(classBlock);

  const className =
    lines[classLineIndex]?.match(/export\s+class\s+(\w+)/)?.[1] ?? 'Controller';

  const routes = [];

  for (let index = classLineIndex + 1; index < lines.length; index += 1) {
    const verbMatch = lines[index].match(
      new RegExp(`^\\s*@(${HTTP_DECORATORS.join('|')})\\s*\\(`),
    );

    if (!verbMatch) continue;

    const method = verbMatch[1].toUpperCase();
    const routePath = decoratorPath(lines[index]);

    // Decorators attached to this handler: walk up to the previous member, and
    // down to the signature.
    let start = index;

    while (start > classLineIndex + 1 && /^\s*@/.test(lines[start - 1])) {
      start -= 1;
    }

    let end = index;

    while (end < lines.length - 1 && !/\)\s*(:\s*[^{]+)?\s*\{/.test(lines[end])) {
      end += 1;
    }

    const block = lines.slice(start, end + 1).join('\n');
    const signature = lines.slice(index + 1, end + 1).join('\n');

    // The method name is on the first non-decorator line after the verb — read
    // off the whole block it matches `@Post(` and every request ends up called
    // "Post".
    const handler =
      lines
        .slice(index + 1, end + 2)
        .find((line) => /^\s*(?:async\s+)?\w+\s*\(/.test(line) && !/^\s*@/.test(line))
        ?.match(/^\s*(?:async\s+)?(\w+)\s*\(/)?.[1] ?? 'handler';

    const isPublic = /@Public\(\)/.test(block);
    const methodGuards = [...block.matchAll(/@UseGuards\(([^)]*)\)/g)]
      .map((match) => match[1])
      .join(',');

    const guards = [controllerGuards, methodGuards].filter(Boolean).join(',');

    routes.push({
      method,
      path: routePath,
      handler,
      params: [...signature.matchAll(/@Param\(\s*['"`](\w+)['"`]/g)].map((m) => m[1]),
      headers: [...signature.matchAll(/@Headers\(\s*['"`]([\w-]+)['"`]/g)].map(
        (m) => m[1],
      ),
      bodyDto: signature.match(/@Body\(\)\s*\w+\s*:\s*(\w+)/)?.[1] ?? null,
      queryDto: signature.match(/@Query\(\)\s*\w+\s*:\s*(\w+)/)?.[1] ?? null,
      // `@Query('shortUrl')` names a single parameter rather than a DTO. Left
      // out, the request looks complete but answers 404 the moment you send it.
      queryParams: [...signature.matchAll(/@Query\(\s*['"`](\w+)['"`]/g)].map(
        (m) => m[1],
      ),
      paginated: /@Paginate\(\)/.test(signature),
      upload: /@Uploaded(File|Files)\(/.test(signature),
      requiresAuth: !isPublic && /JwtAuthGuard/.test(guards),
      requiresBookingToken: /BookingAccessGuard/.test(guards),
      isPublic: isPublic || !guards,
    });
  }

  return { file, className, prefix, routes };
}

// ------------------------------------------------------------ body skeletons

const PRIMITIVE_SAMPLES = {
  string: '',
  number: 0,
  boolean: false,
  Date: '2026-01-01T00:00:00.000Z',
};

/**
 * Builds a placeholder body from the DTO's declared fields.
 *
 * Best effort by design: it reads the class body for `name?: type;` pairs and
 * fills in a value by type. Enums become the first documented value so the
 * request is at least valid; anything unrecognised becomes null, which is
 * visibly a placeholder rather than a plausible-looking lie.
 */
function buildBodySample(dtoName, depth = 0) {
  if (!dtoName || depth > 4) return {};

  const found = findDtoFile(dtoName);

  if (!found) return {};

  const { source } = found;

  const classStart = source.search(
    new RegExp(`export\\s+class\\s+${dtoName}\\b`),
  );

  if (classStart === -1) return {};

  // Take the class body up to the next top-level `export class`.
  const rest = source.slice(classStart);
  const nextClass = rest.slice(1).search(/\nexport\s+(class|const|function)\s/);
  const body = nextClass === -1 ? rest : rest.slice(0, nextClass + 1);

  // Follow the `extends` clause first, so inherited fields survive.
  //
  // Most update DTOs are declared `extends PartialType(CreateFooDto)` and
  // declare nothing themselves, which used to produce an empty `{}` body —
  // a request nobody could actually send. Mapped-type helpers wrap the parent
  // in a call, so the parent is the first capitalised identifier either way.
  const extendsClause = body.match(
    /export\s+class\s+\w+\s+extends\s+([\s\S]*?)\s*\{/,
  );

  let sample = {};

  if (extendsClause) {
    // Helpers nest — `PartialType(OmitType(CreateAdminDto, [...]))` — so take
    // the first identifier in the clause that is not one of them.
    const MAPPED_TYPE_HELPERS = new Set([
      'PartialType',
      'OmitType',
      'PickType',
      'IntersectionType',
    ]);

    const clause = extendsClause[1];

    const parent = (clause.match(/[A-Z]\w+/g) || []).find(
      (name) => !MAPPED_TYPE_HELPERS.has(name) && name !== dtoName,
    );

    if (parent) {
      sample = { ...buildBodySample(parent, depth + 1) };

      // Honour the field lists on Omit/Pick. Without this the skeleton offers
      // fields the API rejects outright — `forbidNonWhitelisted` answers 422,
      // which is exactly the sort of dead request this collection exists to
      // avoid handing people.
      const keysIn = (helper) => {
        const match = clause.match(
          new RegExp(`${helper}\\s*\\([^,]+,\\s*\\[([^\\]]*)\\]`),
        );

        return match
          ? [...match[1].matchAll(/['"](\w+)['"]/g)].map((m) => m[1])
          : null;
      };

      const omitted = keysIn('OmitType');
      if (omitted) omitted.forEach((key) => delete sample[key]);

      const picked = keysIn('PickType');
      if (picked) {
        sample = Object.fromEntries(
          Object.entries(sample).filter(([key]) => picked.includes(key)),
        );
      }
    }
  }

  const fieldPattern =
    /^\s{2}(?:readonly\s+)?(\w+)(\?)?!?\s*:\s*([\w<>\[\]| ]+);/gm;

  for (const match of body.matchAll(fieldPattern)) {
    const [, name, , rawType] = match;

    if (['constructor', 'data'].includes(name)) continue;

    const type = rawType.replace(/\s/g, '').split('|')[0];
    const isArray = type.endsWith('[]');
    const base = type.replace(/\[\]$/, '');

    let value;

    if (base in PRIMITIVE_SAMPLES) {
      value = PRIMITIVE_SAMPLES[base];
    } else if (/^(Record|any|object)/.test(base)) {
      value = {};
    } else {
      // A referenced DTO or enum. Enums are worth resolving — an invalid value
      // there is the most common reason a request bounces with a 422.
      const enumValues = resolveEnumValues(base);

      value = enumValues
        ? enumValues[0]
        : Object.keys(buildBodySample(base, depth + 1)).length
          ? buildBodySample(base, depth + 1)
          : null;
    }

    sample[name] = isArray ? [value] : value;
  }

  return sample;
}

function resolveEnumValues(enumName) {
  const declaration = new RegExp(`export\\s+enum\\s+${enumName}\\s*\\{([^}]*)\\}`);

  for (const file of allSourceFiles) {
    const source = readFileSync(file, 'utf8');
    const match = source.match(declaration);

    if (match) {
      const values = [...match[1].matchAll(/=\s*['"`]([^'"`]*)['"`]/g)].map(
        (m) => m[1],
      );

      return values.length ? values : null;
    }
  }

  return null;
}

// ------------------------------------------------------------------- postman

function toPostmanRequest(route, appConfig, folderName) {
  const rawPath = joinPath(appConfig.prefix, route.controllerPrefix, route.path);

  // Postman writes path parameters as :name and lists them separately.
  const segments = rawPath.split('/');

  const header = [];

  if (route.bodyDto && !route.upload) {
    header.push({ key: 'Content-Type', value: 'application/json' });
  }

  if (route.requiresAuth) {
    header.push({ key: 'Authorization', value: 'Bearer {{accessToken}}' });
  }

  if (route.requiresBookingToken) {
    header.push({ key: 'x-booking-token', value: '{{bookingToken}}' });
  }

  for (const name of route.headers) {
    header.push({ key: name, value: `{{${headerVariable(name)}}}` });
  }

  const request = {
    method: route.method,
    header,
    url: {
      raw: `{{${appConfig.baseUrlVar}}}/${rawPath}`,
      host: [`{{${appConfig.baseUrlVar}}}`],
      path: segments,
      variable: route.params.map((name) => ({
        key: name,
        value: '',
        description: 'required',
      })),
    },
    description: buildDescription(route, folderName),
  };

  if (route.paginated) {
    request.url.query = [
      { key: 'page', value: '1', disabled: true },
      { key: 'limit', value: '10', disabled: true },
      { key: 'search', value: '', disabled: true },
      { key: 'sortBy', value: 'createdAt:DESC', disabled: true },
    ];
  }

  if (route.queryDto) {
    const sample = buildBodySample(route.queryDto);

    request.url.query = [
      ...(request.url.query ?? []),
      ...Object.keys(sample).map((key) => ({
        key,
        value: '',
        disabled: true,
      })),
    ];
  }

  // Named query parameters are enabled, not disabled: the handler asked for
  // them by name, so they are almost always required.
  for (const name of route.queryParams ?? []) {
    request.url.query = [
      ...(request.url.query ?? []),
      { key: name, value: '', description: 'required' },
    ];
  }

  if (request.url.query?.length) {
    const enabled = request.url.query
      .filter((entry) => !entry.disabled)
      .map((entry) => `${entry.key}=${entry.value}`)
      .join('&');

    if (enabled) request.url.raw = `${request.url.raw}?${enabled}`;
  }

  if (route.upload) {
    request.body = { mode: 'formdata', formdata: [{ key: 'files', type: 'file', src: [] }] };
  } else if (route.bodyDto) {
    request.body = {
      mode: 'raw',
      raw: JSON.stringify(buildBodySample(route.bodyDto), null, 2),
      options: { raw: { language: 'json' } },
    };
  }

  return { name: humanise(route.handler), request, response: [] };
}

function headerVariable(name) {
  return name
    .replace(/^x-/, '')
    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function buildDescription(route, folderName) {
  const lines = [`\`${route.method}\` handled by \`${folderName}.${route.handler}()\``];

  if (route.requiresAuth) {
    lines.push('- Requires an admin bearer token (`{{accessToken}}`).');
  }

  if (route.requiresBookingToken) {
    lines.push(
      '- Accepts the guest booking link token in `x-booking-token`, or an admin bearer token.',
    );
  }

  if (route.isPublic && !route.requiresAuth && !route.requiresBookingToken) {
    lines.push('- Public: no authentication.');
  }

  if (route.bodyDto) lines.push(`- Body shaped by \`${route.bodyDto}\`.`);
  if (route.queryDto) lines.push(`- Query shaped by \`${route.queryDto}\`.`);
  if (route.paginated) lines.push('- Paginated (`nestjs-paginate`).');

  return lines.join('\n');
}

function humanise(handler) {
  return handler
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (character) => character.toUpperCase());
}

function folderTitle(className) {
  return humanise(className.replace(/Controller$/, ''));
}

// ---------------------------------------------------------------------- main

const controllers = findControllers()
  .map(parseController)
  .filter((controller) => controller && controller.routes.length > 0);

const folders = [];
let routeCount = 0;

for (const [appName, appConfig] of Object.entries(APPS)) {
  const appControllers = controllers
    .filter((controller) =>
      relative(APPS_ROOT, controller.file).replace(/\\/g, '/').startsWith(`${appName}/`),
    )
    .sort((a, b) => a.className.localeCompare(b.className));

  if (!appControllers.length) continue;

  const items = appControllers.map((controller) => {
    const folderName = folderTitle(controller.className);

    return {
      name: folderName,
      description: `\`${relative(BACKEND_ROOT, controller.file).replace(/\\/g, '/')}\``,
      item: controller.routes.map((route) => {
        routeCount += 1;

        return toPostmanRequest(
          { ...route, controllerPrefix: controller.prefix },
          appConfig,
          controller.className,
        );
      }),
    };
  });

  folders.push({
    name: appName === 'main' ? 'Main API (:3000)' : 'External Gateway (:3002)',
    item: items,
  });
}

// The login request is hand-written: it is the one call every other request
// depends on, and it stores the token so the collection is usable immediately.
folders.unshift({
  name: 'Getting started',
  item: [
    {
      name: 'Admin login (saves accessToken)',
      event: [
        {
          listen: 'test',
          script: {
            type: 'text/javascript',
            exec: [
              'const body = pm.response.json();',
              'const token = body?.data?.accessToken;',
              '',
              '// Postman resolves an environment variable over a collection one.',
              '// Writing only to the collection would leave an empty environment',
              '// `accessToken` shadowing the real token, and every authenticated',
              '// request would come back 401 with nothing obviously wrong.',
              'if (token) {',
              '  if (pm.environment.name) {',
              "    pm.environment.set('accessToken', token);",
              '  } else {',
              "    pm.collectionVariables.set('accessToken', token);",
              '  }',
              '',
              "  console.log('accessToken stored in', pm.environment.name || 'collection variables');",
              '}',
              '',
              "pm.test('login succeeded', () => pm.response.to.have.status(200));",
              "pm.test('an access token came back', () => pm.expect(token).to.be.a('string').and.not.empty);",
            ],
          },
        },
      ],
      request: {
        method: 'POST',
        header: [{ key: 'Content-Type', value: 'application/json' }],
        url: {
          raw: '{{baseUrl}}/api/{{apiVersion}}/auth/login',
          host: ['{{baseUrl}}'],
          path: ['api', '{{apiVersion}}', 'auth', 'login'],
        },
        body: {
          mode: 'raw',
          raw: JSON.stringify({ identifier: '{{adminIdentifier}}', password: '{{adminPassword}}' }, null, 2),
          options: { raw: { language: 'json' } },
        },
        description:
          'Run this first. The test script writes `accessToken` into the collection variables, which every authenticated request below reads.',
      },
      response: [],
    },
  ],
});

const collection = {
  info: {
    _postman_id: '5c8f2f4e-0a1d-4c3b-9f52-1d2a3b4c5d6e',
    name: 'Lind Society API',
    description: [
      'Generated from the NestJS controllers by `scripts/generate-postman-collection.mjs`.',
      '',
      'Regenerate rather than edit by hand — a hand-edited collection drifts the',
      'first time someone adds an endpoint without updating it.',
      '',
      '## Getting started',
      '1. Set the `baseUrl` variable if you are not running on localhost.',
      '2. Run **Getting started → Admin login**; it stores `accessToken` for you.',
      '3. Guest-facing booking routes read `bookingToken` instead — paste the token',
      '   from the end of a booking link (`/booking/<token>`).',
      '',
      'Request bodies are skeletons derived from the DTO classes. Fields the',
      'generator could not infer are `null`; fill them in before sending.',
    ].join('\n'),
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  item: folders,
  variable: [
    { key: 'baseUrl', value: 'http://localhost:3000' },
    { key: 'gatewayUrl', value: 'http://localhost:3002' },
    { key: 'apiVersion', value: 'v1' },
    { key: 'adminIdentifier', value: 'admin' },
    { key: 'adminPassword', value: '' },
    { key: 'accessToken', value: '' },
    { key: 'bookingToken', value: '' },
    { key: 'callbackToken', value: '' },
    { key: 'whatsappToken', value: '' },
  ],
};

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, `${JSON.stringify(collection, null, 2)}\n`);

const folderCount = folders.reduce((sum, folder) => sum + (folder.item?.length ?? 0), 0);

console.log(`wrote ${relative(BACKEND_ROOT, OUT_PATH).replace(/\\/g, '/')}`);
console.log(`  ${routeCount} requests across ${folderCount} folders`);

// ------------------------------------------------------------- environment

function readEnvFile() {
  try {
    const raw = readFileSync(join(BACKEND_ROOT, '.env'), 'utf8');
    const values = {};

    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);

      if (match) values[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }

    return values;
  } catch {
    return {};
  }
}

const env = readEnvFile();
const withSecrets = args.includes('--with-secrets');

const host = env.HOST || 'localhost';

/**
 * Secrets are blank unless `--with-secrets` is passed.
 *
 * An environment file is the thing people export and paste into chats, so it
 * defaults to carrying none of the values that matter. The README says where
 * each one comes from.
 */
const secret = (value) => (withSecrets ? (value ?? '') : '');

const environment = {
  id: 'f1e2d3c4-b5a6-4978-8a9b-0c1d2e3f4a5b',
  name: 'Lind Society — local',
  values: [
    { key: 'baseUrl', value: `http://${host}:${env.MAIN_PORT || 3000}`, type: 'default', enabled: true },
    {
      key: 'gatewayUrl',
      value: `http://${host}:${env.EXTERNAL_GATEWAY_PORT || 3002}`,
      type: 'default',
      enabled: true,
    },
    { key: 'apiVersion', value: env.API_VERSION || 'v1', type: 'default', enabled: true },
    { key: 'adminIdentifier', value: 'admin', type: 'default', enabled: true },
    // Filled in by the login request's test script, never by hand.
    { key: 'adminPassword', value: '', type: 'secret', enabled: true },
    { key: 'accessToken', value: '', type: 'secret', enabled: true },
    // The last path segment of a guest booking link.
    { key: 'bookingToken', value: '', type: 'secret', enabled: true },
    {
      key: 'callbackToken',
      value: secret(env.XENDIT_WEBHOOK_VERIFICATION_TOKEN),
      type: 'secret',
      enabled: true,
    },
    {
      key: 'whatsappToken',
      value: secret(env.WHATSAPP_WEBHOOK_TOKEN),
      type: 'secret',
      enabled: true,
    },
  ],
  _postman_variable_scope: 'environment',
};

const ENV_PATH = join(
  dirname(OUT_PATH),
  'lind-society.local.postman_environment.json',
);

writeFileSync(ENV_PATH, `${JSON.stringify(environment, null, 2)}\n`);

console.log(`wrote ${relative(BACKEND_ROOT, ENV_PATH).replace(/\\/g, '/')}`);
console.log(
  withSecrets
    ? '  secrets filled from .env — do not share or commit this file'
    : '  secrets left blank (pass --with-secrets to fill them from .env)',
);
