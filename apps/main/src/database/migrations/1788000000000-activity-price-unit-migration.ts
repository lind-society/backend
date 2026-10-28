import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds the price unit shown on the public site as "/{priceUnit}" (e.g.
 * "/session", "/person") — previously hardcoded as "/session" everywhere,
 * with no way to change it per activity from the dashboard.
 *
 * `activities_view` does `SELECT a.*, ... AS total_today_booking`, which
 * Postgres expands and freezes at CREATE VIEW time — it does not pick up a
 * later ADD COLUMN on its own. CREATE OR REPLACE can only append a new
 * trailing column, but the new `price_unit` lands inside `a.*`, ahead of
 * `total_today_booking`, which shifts that column's position — Postgres
 * rejects that as an implicit rename. So the view is dropped and recreated
 * from scratch instead, both here and in `down`.
 */
export class Migration1788000000000 implements MigrationInterface {
  name = 'Migration1788000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS "activities_view"`);

    await queryRunner.query(`
      ALTER TABLE "activities"
      ADD COLUMN IF NOT EXISTS "price_unit" varchar(50)
    `);

    await queryRunner.query(`
      CREATE VIEW "activities_view" AS
      SELECT
          a.*,
          COALESCE(tb.total_today_booking, 0) AS total_today_booking
      FROM
          activities a
      LEFT JOIN (
          SELECT
              b.activity_id,
              COUNT(*) AS total_today_booking
          FROM
              bookings b
          WHERE
              b.status = 'completed'
              AND b.booking_date >= date_trunc('day', now())
              AND b.booking_date < date_trunc('day', now()) + interval '1 day'
          GROUP BY
              b.activity_id
      ) tb
      ON tb.activity_id = a.id
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Postgres won't let ALTER TABLE DROP COLUMN run while the view still
    // depends on it (even via a frozen `a.*` expansion), and CREATE OR REPLACE
    // VIEW can only append columns, not remove one — so the view has to be
    // dropped and recreated from scratch around the column drop.
    await queryRunner.query(`DROP VIEW IF EXISTS "activities_view"`);

    await queryRunner.query(`
      ALTER TABLE "activities"
      DROP COLUMN IF EXISTS "price_unit"
    `);

    await queryRunner.query(`
      CREATE VIEW "activities_view" AS
      SELECT
          a.*,
          COALESCE(tb.total_today_booking, 0) AS total_today_booking
      FROM
          activities a
      LEFT JOIN (
          SELECT
              b.activity_id,
              COUNT(*) AS total_today_booking
          FROM
              bookings b
          WHERE
              b.status = 'completed'
              AND b.booking_date >= date_trunc('day', now())
              AND b.booking_date < date_trunc('day', now()) + interval '1 day'
          GROUP BY
              b.activity_id
      ) tb
      ON tb.activity_id = a.id
    `);
  }
}
