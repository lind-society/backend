import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742585270572 implements MigrationInterface {
    name = 'Migration1742585270572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "discount_type"`);
        await queryRunner.query(`DROP TYPE "public"."villas_discount_type_enum"`);
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "rating" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "price_daily_after_discount"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_daily_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`ALTER TABLE "villas" ADD "price_daily_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_daily_type = 'percentage' THEN 
          GREATEST(price_daily - (price_daily * discount_daily / 100), 0)
        ELSE 
          GREATEST(price_daily - discount_daily, 0)
      END
    ) STORED`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_daily_after_discount","\n      CASE \n        WHEN discount_daily_type = 'percentage' THEN \n          GREATEST(price_daily - (price_daily * discount_daily / 100), 0)\n        ELSE \n          GREATEST(price_daily - discount_daily, 0)\n      END\n    "]);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "price_monthly_after_discount"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_monthly_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`ALTER TABLE "villas" ADD "price_monthly_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_monthly_type = 'percentage' THEN 
          GREATEST(price_monthly - (price_monthly * discount_monthly / 100), 0)
        ELSE 
          GREATEST(price_monthly - discount_monthly, 0)
      END
    ) STORED`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_monthly_after_discount","\n      CASE \n        WHEN discount_monthly_type = 'percentage' THEN \n          GREATEST(price_monthly - (price_monthly * discount_monthly / 100), 0)\n        ELSE \n          GREATEST(price_monthly - discount_monthly, 0)\n      END\n    "]);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "price_yearly_after_discount"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_yearly_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`ALTER TABLE "villas" ADD "price_yearly_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_yearly_type = 'percentage' THEN 
          GREATEST(price_yearly - (price_yearly * discount_yearly / 100), 0)
        ELSE 
          GREATEST(price_yearly - discount_yearly, 0)
      END
    ) STORED`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_yearly_after_discount","\n      CASE \n        WHEN discount_yearly_type = 'percentage' THEN \n          GREATEST(price_yearly - (price_yearly * discount_yearly / 100), 0)\n        ELSE \n          GREATEST(price_yearly - discount_yearly, 0)\n      END\n    "]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_yearly_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "price_yearly_after_discount"`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_yearly_after_discount","\n      CASE \n        WHEN discount_type = 'percentage' THEN \n          GREATEST(price_yearly - (price_yearly * discount_yearly / 100), 0)\n        ELSE \n          GREATEST(price_yearly - discount_yearly, 0)\n      END\n    "]);
        await queryRunner.query(`ALTER TABLE "villas" ADD "price_yearly_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_type = 'percentage' THEN 
          GREATEST(price_yearly - (price_yearly * discount_yearly / 100), 0)
        ELSE 
          GREATEST(price_yearly - discount_yearly, 0)
      END
    ) STORED`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_monthly_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "price_monthly_after_discount"`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_monthly_after_discount","\n      CASE \n        WHEN discount_type = 'percentage' THEN \n          GREATEST(price_monthly - (price_monthly * discount_monthly / 100), 0)\n        ELSE \n          GREATEST(price_monthly - discount_monthly, 0)\n      END\n    "]);
        await queryRunner.query(`ALTER TABLE "villas" ADD "price_monthly_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_type = 'percentage' THEN 
          GREATEST(price_monthly - (price_monthly * discount_monthly / 100), 0)
        ELSE 
          GREATEST(price_monthly - discount_monthly, 0)
      END
    ) STORED`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_daily_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "price_daily_after_discount"`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_daily_after_discount","\n      CASE \n        WHEN discount_type = 'percentage' THEN \n          GREATEST(price_daily - (price_daily * discount_daily / 100), 0)\n        ELSE \n          GREATEST(price_daily - discount_daily, 0)\n      END\n    "]);
        await queryRunner.query(`ALTER TABLE "villas" ADD "price_daily_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_type = 'percentage' THEN 
          GREATEST(price_daily - (price_daily * discount_daily / 100), 0)
        ELSE 
          GREATEST(price_daily - discount_daily, 0)
      END
    ) STORED`);
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "rating" DROP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."villas_discount_type_enum" AS ENUM('percentage', 'fixed')`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "discount_type" "public"."villas_discount_type_enum"`);
    }

}
