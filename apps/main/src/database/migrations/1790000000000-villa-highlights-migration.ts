import { MigrationInterface, QueryRunner } from 'typeorm';

/** Villa Highlights tab: "What's Included" and "Good to Know" bullet lists. */
export class Migration1790000000000 implements MigrationInterface {
  name = 'Migration1790000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "villas" ADD COLUMN IF NOT EXISTS "whats_included" text array`,
    );
    await queryRunner.query(
      `ALTER TABLE "villas" ADD COLUMN IF NOT EXISTS "good_to_know" text array`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "good_to_know"`);
    await queryRunner.query(
      `ALTER TABLE "villas" DROP COLUMN "whats_included"`,
    );
  }
}
