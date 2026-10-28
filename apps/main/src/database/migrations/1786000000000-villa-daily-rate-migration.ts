import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Per-date pricing calendar for villas.
 *
 * Adds `villa_daily_rates`, the top layer of nightly-rate resolution:
 *
 *   daily override -> price rule season -> villa season tier -> dailyPrice
 *
 * Purely additive. Villas with no rows here keep pricing exactly as before, so
 * existing bookings and listings are untouched.
 */
export class Migration1786000000000 implements MigrationInterface {
  name = 'Migration1786000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "villa_daily_rates" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "villa_id" uuid NOT NULL,
        "date" date NOT NULL,
        "price" numeric(15,2),
        "min_stay" smallint,
        "is_blocked" boolean NOT NULL DEFAULT false,
        "note" text,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "pk_villa_daily_rates" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "villa_daily_rates"
      DROP CONSTRAINT IF EXISTS "fk_villa_daily_rates_villa"
    `);
    await queryRunner.query(`
      ALTER TABLE "villa_daily_rates"
      ADD CONSTRAINT "fk_villa_daily_rates_villa"
      FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE CASCADE
    `);

    // One row per villa per day. Partial so a soft-deleted row does not block
    // the date from being configured again.
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "uq_villa_daily_rate_villa_date"
      ON "villa_daily_rates" ("villa_id", "date")
      WHERE "deleted_at" IS NULL
    `);

    // Calendar reads are always "one villa, one date window".
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_villa_daily_rate_villa_date"
      ON "villa_daily_rates" ("villa_id", "date")
    `);

    await queryRunner.query(`
      ALTER TABLE "villa_daily_rates"
      DROP CONSTRAINT IF EXISTS "chk_villa_daily_rate_min_stay"
    `);
    await queryRunner.query(`
      ALTER TABLE "villa_daily_rates"
      ADD CONSTRAINT "chk_villa_daily_rate_min_stay"
      CHECK ("min_stay" IS NULL OR "min_stay" >= 1)
    `);

    await queryRunner.query(`
      ALTER TABLE "villa_daily_rates"
      DROP CONSTRAINT IF EXISTS "chk_villa_daily_rate_price"
    `);
    await queryRunner.query(`
      ALTER TABLE "villa_daily_rates"
      ADD CONSTRAINT "chk_villa_daily_rate_price"
      CHECK ("price" IS NULL OR "price" >= 0)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_villa_daily_rate_villa_date"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "uq_villa_daily_rate_villa_date"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "villa_daily_rates"`);
  }
}
