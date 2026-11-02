# Lind Society Backend

NestJS monorepo (Node 24, pnpm) with four apps that share one Docker image:

| App                | Port | Role                                          |
| ------------------ | ---- | --------------------------------------------- |
| `main`             | 4782 | REST API, database, storage                   |
| `external-gateway` | 4783 | API for partner sites                         |
| `mail`             | -    | RabbitMQ consumer that sends email            |
| `whatsapp`         | -    | RabbitMQ consumer driving WhatsApp Web        |

Infrastructure: PostgreSQL (your own, not in the compose file), RabbitMQ and an
S3-compatible store (SeaweedFS).

## Run everything with Docker

From the repository root (one level up), which also starts both frontends:

```bash
cp backend/.env.example backend/.env   # then replace the CHANGE_ME values
docker compose up -d --build
```

API: http://localhost:4782/api/v1. Migrations run automatically through the
`migrate` service before `main` starts.

## Local development

```bash
pnpm install
pnpm start:dev          # main, with watch
pnpm test               # jest
pnpm migration:run      # needs a reachable database
pnpm admin:create --email admin@lind.test --password Admin12345
pnpm seed:demo --identifier admin@lind.test --password Admin12345   # demo content
```

Environment variables are documented in `.env.example`.

## Production: first data

Migrations run by themselves on every deploy (the `migrate` service). Data does
not: a new production database is empty.

1. Deploy the backend (push to `main` or run the Deploy workflow).
2. Create the first admin, on the server:
   ```bash
   cd /opt/lind_society/backend/current
   docker compose -f docker-compose.prod.yml run --rm --entrypoint node migrate \
     scripts/create-admin.mjs --email you@example.com --password 'StrongPass1'
   ```
3. Log in to the admin and add the real content.
4. Optional, demo content only: run the seeder from your own computer against
   the live API (it uploads the sample photos from `../frontend-user/public/images`):
   ```bash
   cd backend
   API_URL=http://185.196.21.56:4782/api/v1 pnpm seed:demo \
     --identifier you@example.com --password 'StrongPass1'
   ```
   It is safe to re-run; existing names are skipped. Do not seed a real shop
   with demo villas.

Take a database dump before a deploy that adds a migration:
`/etc/cron.daily/lind-db-backup`.

## Notes

- `deploy/` holds the production image (`Dockerfile`), the container entry
  point (`start.sh`) and the VPS scripts.
- `nest build` copies assets (`country-code.json`, mail templates) through the
  `assets` entries in `nest-cli.json`.
- TypeORM is on 0.3.x. TypeORM 1.x removes APIs used here
  (`loadRelationCountAndMap`, array `select`), so upgrading it is a separate task.
