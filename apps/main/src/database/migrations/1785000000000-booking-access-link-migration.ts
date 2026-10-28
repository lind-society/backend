import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Backs the guest-checkout booking flow:
 *
 * - `access_token` / `access_expires_at` make the "book inform" link openable
 *   without a login, and closable when the booking is cancelled.
 * - `closed_reason` records why a negotiation ended.
 * - `customer_notified_at` / `owner_notified_at` record whether the automatic
 *   WhatsApp actually went out, since delivery is fire-and-forget.
 *
 * Existing rows get a token backfilled so links keep working for bookings that
 * were created before this migration.
 */
export class Migration1785000000000 implements MigrationInterface {
  name = 'Migration1785000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "access_token" character varying(64)`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "access_expires_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "closed_reason" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "customer_notified_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "owner_notified_at" TIMESTAMP WITH TIME ZONE`,
    );

    // Backfill so links keep working for bookings created before this change.
    // md5() is used instead of pgcrypto's gen_random_bytes() to avoid adding an
    // extension dependency; these tokens are only a stop-gap for legacy rows and
    // every new booking gets a crypto-random token from the application.
    await queryRunner.query(`
      UPDATE "bookings"
      SET "access_token" = md5(random()::text || clock_timestamp()::text) || md5("id"::text || clock_timestamp()::text),
          "access_expires_at" = COALESCE("check_out_date", "booking_date", now()) + interval '30 days'
      WHERE "access_token" IS NULL
    `);

    // Postgres already allows multiple NULLs under a unique index, so a plain
    // one is enough and stays closer to what TypeORM generates for the entity's
    // `unique: true`.
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_bookings_access_token" ON "bookings" ("access_token")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_bookings_access_token"`);
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP COLUMN IF EXISTS "owner_notified_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP COLUMN IF EXISTS "customer_notified_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP COLUMN IF EXISTS "closed_reason"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP COLUMN IF EXISTS "access_expires_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP COLUMN IF EXISTS "access_token"`,
    );
  }
}
