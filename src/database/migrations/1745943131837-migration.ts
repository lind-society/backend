import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745943131837 implements MigrationInterface {
    name = 'Migration1745943131837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "price_per_person_after_discount"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "price_per_session_after_discount"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_per_person_after_discount","lind_society_dev","public","activities"]);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "price_per_session"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "price_per_person"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "daily_base_price_after_season_rate"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "peak_season_price_rate"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "high_season_price_rate"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "daily_base_price"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "low_season_price_rate"`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "price" numeric(15,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "price_after_discount" numeric(15,2) GENERATED ALWAYS AS (
          CASE 
            WHEN discount_type = 'fixed' THEN 
              GREATEST(price - COALESCE(discount, 0), 0)
            ELSE 
              GREATEST(price - (price * COALESCE(discount, 0) / 100), 0)
          END
        ) STORED`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","activities","GENERATED_COLUMN","price_after_discount","\n      CASE \n        WHEN discount_type = 'fixed' THEN \n          GREATEST(price - COALESCE(discount, 0), 0)\n        ELSE \n          GREATEST(price - (price * COALESCE(discount, 0) / 100), 0)\n      END\n    "]);
        await queryRunner.query(`ALTER TABLE "activities" ADD "daily_limit" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "daily_price" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "low_season_daily_price" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "high_season_daily_price" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "peak_season_daily_price" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "daily_price_after_discount" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "low_season_daily_price_after_discount" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "high_season_daily_price_after_discount" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "peak_season_daily_price_after_discount" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "price" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" ALTER COLUMN "start_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" ALTER COLUMN "end_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" ALTER COLUMN "price_rule_season" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villa_price_rules" ALTER COLUMN "price_rule_season" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" ALTER COLUMN "end_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" ALTER COLUMN "start_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "price" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "peak_season_daily_price_after_discount"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "high_season_daily_price_after_discount"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "low_season_daily_price_after_discount"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "daily_price_after_discount"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "peak_season_daily_price"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "high_season_daily_price"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "low_season_daily_price"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "daily_price"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "daily_limit"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_after_discount","lind_society_dev","public","activities"]);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "price_after_discount"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "low_season_price_rate" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "daily_base_price" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "high_season_price_rate" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "peak_season_price_rate" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "daily_base_price_after_season_rate" numeric(15,2)`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","activities","GENERATED_COLUMN","price_per_session_after_discount","\n      CASE \n        WHEN discount_type = 'fixed' THEN \n          GREATEST(price_per_session - COALESCE(discount, 0), 0)\n        ELSE \n          GREATEST(price_per_session - (price_per_session * COALESCE(discount, 0) / 100), 0)\n      END\n    "]);
        await queryRunner.query(`ALTER TABLE "activities" ADD "price_per_person" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "price_per_session" numeric(15,2)`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","activities","GENERATED_COLUMN","price_per_person_after_discount","\n      CASE \n        WHEN discount_type = 'fixed' THEN \n          GREATEST(price_per_person - COALESCE(discount, 0), 0)\n        ELSE \n          GREATEST(price_per_person - (price_per_person * COALESCE(discount, 0) / 100), 0)\n      END\n    "]);
        await queryRunner.query(`ALTER TABLE "activities" ADD "price_per_session_after_discount" numeric(15,2) GENERATED ALWAYS AS (
          CASE 
            WHEN discount_type = 'fixed' THEN 
              GREATEST(price_per_session - COALESCE(discount, 0), 0)
            ELSE 
              GREATEST(price_per_session - (price_per_session * COALESCE(discount, 0) / 100), 0)
          END
        ) STORED`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "price_per_person_after_discount" numeric(15,2) GENERATED ALWAYS AS (
          CASE 
            WHEN discount_type = 'fixed' THEN 
              GREATEST(price_per_person - COALESCE(discount, 0), 0)
            ELSE 
              GREATEST(price_per_person - (price_per_person * COALESCE(discount, 0) / 100), 0)
          END
        ) STORED`);
    }

}
