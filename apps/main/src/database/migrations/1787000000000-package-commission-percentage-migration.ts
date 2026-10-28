import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * The public "manage your property" pricing page (Online Marketing / Full
 * Management / Premium Management) used to hardcode its commission
 * percentages in the frontend. This makes that value admin-editable per
 * package, alongside the name/description/benefits it already had.
 */
export class Migration1787000000000 implements MigrationInterface {
  name = 'Migration1787000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "packages"
      ADD COLUMN IF NOT EXISTS "commission_percentage" numeric(5,2)
    `);

    await queryRunner.query(`
      ALTER TABLE "packages"
      DROP CONSTRAINT IF EXISTS "chk_package_commission_percentage"
    `);
    await queryRunner.query(`
      ALTER TABLE "packages"
      ADD CONSTRAINT "chk_package_commission_percentage"
      CHECK ("commission_percentage" IS NULL OR ("commission_percentage" >= 0 AND "commission_percentage" <= 100))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "packages"
      DROP CONSTRAINT IF EXISTS "chk_package_commission_percentage"
    `);
    await queryRunner.query(`
      ALTER TABLE "packages"
      DROP COLUMN IF EXISTS "commission_percentage"
    `);
  }
}
