import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745947152903 implements MigrationInterface {
    name = 'Migration1745947152903'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "villa_price_rules" RENAME COLUMN "price_rule_season" TO "season"`);
      await queryRunner.query(`CREATE TYPE "public"."villa_price_rule_season_enum" AS ENUM('Regular Season', 'Low Season', 'High Season', 'Peak Season')`);
      await queryRunner.query(`ALTER TABLE "villa_price_rules" ALTER COLUMN "season" TYPE "public"."villa_price_rule_season_enum" USING "season"::"text"::"public"."villa_price_rule_season_enum"`);
      await queryRunner.query(`DROP TYPE "public"."price_rule_season_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "villa_price_rules" RENAME COLUMN "season" TO "price_rule_season"`);
      await queryRunner.query(`CREATE TYPE "public"."price_rule_season_enum" AS ENUM('Low Season', 'Regular Season', 'High Season', 'Peak Season')`);
      await queryRunner.query(`ALTER TABLE "villa_price_rules" ALTER COLUMN "price_rule_season" TYPE "public"."price_rule_season_enum" USING "season"::"text"::"public"."price_rule_season_enum"`);
      await queryRunner.query(`DROP TYPE "public"."villa_price_rule_season_enum"`);
    }

}
