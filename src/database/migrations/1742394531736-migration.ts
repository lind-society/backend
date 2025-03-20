import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742394531736 implements MigrationInterface {
    name = 'Migration1742394531736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "list"`);
        await queryRunner.query(`CREATE TYPE "public"."activities_discount_type_enum" AS ENUM('percentage', 'fixed')`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "discount_type" "public"."activities_discount_type_enum"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "price_per_person"`);
        await queryRunner.query(`ALTER TABLE "activities" ADD COLUMN "price_per_person" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "price_per_session"`);
        await queryRunner.query(`ALTER TABLE "activities" ADD COLUMN "price_per_session" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "discount" TYPE numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "price_per_person_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_type = 'percentage' THEN 
          GREATEST(price_per_person - (price_per_person * discount / 100), 0)
        ELSE 
          GREATEST(price_per_person - discount, 0)
      END
    ) STORED`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","activities","GENERATED_COLUMN","price_per_person_after_discount","\n      CASE \n        WHEN discount_type = 'percentage' THEN \n          GREATEST(price_per_person - (price_per_person * discount / 100), 0)\n        ELSE \n          GREATEST(price_per_person - discount, 0)\n      END\n    "]);
        await queryRunner.query(`ALTER TABLE "activities" ADD "price_per_session_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_type = 'percentage' THEN 
          GREATEST(price_per_session - (price_per_session * discount / 100), 0)
        ELSE 
          GREATEST(price_per_session - discount, 0)
      END
    ) STORED`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","activities","GENERATED_COLUMN","price_per_session_after_discount","\n      CASE \n        WHEN discount_type = 'percentage' THEN \n          GREATEST(price_per_session - (price_per_session * discount / 100), 0)\n        ELSE \n          GREATEST(price_per_session - discount, 0)\n      END\n    "]);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "activity_id" uuid`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "property_id" uuid`);
        await queryRunner.query(`ALTER TABLE "property_facility_pivot" ADD "include_description" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "price_daily"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD COLUMN "price_daily" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "price_monthly"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD COLUMN "price_monthly" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "price_yearly"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD COLUMN "price_yearly" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "discount_daily"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD COLUMN "discount_daily" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "discount_monthly"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD COLUMN "discount_monthly" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "discount_yearly"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD COLUMN "discount_yearly" numeric(15,2)`);
        await queryRunner.query(`CREATE TYPE "public"."villas_discount_daily_type_enum" AS ENUM('percentage', 'fixed')`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "discount_daily_type" "public"."villas_discount_daily_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."villas_discount_monthly_type_enum" AS ENUM('percentage', 'fixed')`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "discount_monthly_type" "public"."villas_discount_monthly_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."villas_discount_yearly_type_enum" AS ENUM('percentage', 'fixed')`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "discount_yearly_type" "public"."villas_discount_yearly_type_enum"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "price_daily_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_daily_type = 'percentage' THEN 
          GREATEST(price_daily - (price_daily * discount_daily / 100), 0)
        ELSE 
          GREATEST(price_daily - discount_daily, 0)
      END
    ) STORED`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_daily_after_discount","\n      CASE \n        WHEN discount_type = 'percentage' THEN \n          GREATEST(price_daily - (price_daily * discount_daily / 100), 0)\n        ELSE \n          GREATEST(price_daily - discount_daily, 0)\n      END\n    "]);
        await queryRunner.query(`ALTER TABLE "villas" ADD "price_monthly_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_monthly_type = 'percentage' THEN 
          GREATEST(price_monthly - (price_monthly * discount_monthly / 100), 0)
        ELSE 
          GREATEST(price_monthly - discount_monthly, 0)
      END
    ) STORED`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_monthly_after_discount","\n      CASE \n        WHEN discount_type = 'percentage' THEN \n          GREATEST(price_monthly - (price_monthly * discount_monthly / 100), 0)\n        ELSE \n          GREATEST(price_monthly - discount_monthly, 0)\n      END\n    "]);
        await queryRunner.query(`ALTER TABLE "villas" ADD "price_yearly_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_yearly_type = 'percentage' THEN 
          GREATEST(price_yearly - (price_yearly * discount_yearly / 100), 0)
        ELSE 
          GREATEST(price_yearly - discount_yearly, 0)
      END
    ) STORED`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_yearly_after_discount","\n      CASE \n        WHEN discount_type = 'percentage' THEN \n          GREATEST(price_yearly - (price_yearly * discount_yearly / 100), 0)\n        ELSE \n          GREATEST(price_yearly - discount_yearly, 0)\n      END\n    "]);
        await queryRunner.query(`CREATE TYPE "public"."properties_discount_type_enum" AS ENUM('percentage', 'fixed')`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "price"`); 
        await queryRunner.query(`ALTER TABLE "properties" ADD COLUMN "price" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "discount"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD COLUMN "discount" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "discount_type" "public"."properties_discount_type_enum"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "price_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_type = 'percentage' THEN 
          GREATEST(price - (price * discount / 100), 0)
        ELSE 
          GREATEST(price - discount, 0)
      END
    ) STORED`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","properties","GENERATED_COLUMN","price_after_discount","\n      CASE \n        WHEN discount_type = 'percentage' THEN \n          GREATEST(price - (price * discount / 100), 0)\n        ELSE \n          GREATEST(price - discount, 0)\n      END\n    "]);
        await queryRunner.query(`ALTER TABLE "features" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."features_discount_type_enum" AS ENUM('percentage', 'fixed')`);
        await queryRunner.query(`ALTER TABLE "features" ADD "discount_type" "public"."features_discount_type_enum"`);
        await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "price"`); 
        await queryRunner.query(`ALTER TABLE "features" ADD COLUMN "price" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "features" ADD "discount" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "features" ADD "price_after_discount" numeric(15,2) GENERATED ALWAYS AS (
        CASE 
          WHEN discount_type = 'percentage' THEN 
            GREATEST(price - (price * discount / 100), 0)
          ELSE 
            GREATEST(price - discount, 0)
        END
      ) STORED`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","features","GENERATED_COLUMN","price_after_discount","\n        CASE \n          WHEN discount_type = 'percentage' THEN \n            GREATEST(price - (price * discount / 100), 0)\n          ELSE \n            GREATEST(price - discount, 0)\n        END\n      "]);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD COLUMN "rating" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "additionals" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."additionals_type_enum"`);
        await queryRunner.query(`ALTER TABLE "additionals" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_f685cc6413eef0ae1dcfb44251a" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_2b1e1cd13649e9315b28b7f2f0c" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_2b1e1cd13649e9315b28b7f2f0c"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_f685cc6413eef0ae1dcfb44251a"`);
        await queryRunner.query(`ALTER TABLE "additionals" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."additionals_type_enum" AS ENUM('child', 'animal', 'extra', 'other')`);
        await queryRunner.query(`ALTER TABLE "additionals" ADD "type" "public"."additionals_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "rating" TYPE numeric(3,2)`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_after_discount","lind_society_dev","public","features"]);
        await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "price_after_discount"`);
        await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "discount"`);
        await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "features" ADD COLUMN "price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "discount_type"`);
        await queryRunner.query(`DROP TYPE "public"."features_discount_type_enum"`);
        await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "type"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_after_discount","lind_society_dev","public","properties"]);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "price_after_discount"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "discount"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD COLUMN "discount" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD COLUMN "price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "discount_type"`);
        await queryRunner.query(`DROP TYPE "public"."properties_discount_type_enum"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_yearly_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "price_yearly_after_discount"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_monthly_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "price_monthly_after_discount"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_daily_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "price_daily_after_discount"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "discount_yearly"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD COLUMN "discount_yearly" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "discount_monthly"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD COLUMN "discount_monthly" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "discount_daily"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD COLUMN "discount_daily" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "price_yearly"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD COLUMN "price_yearly" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "price_monthly"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD COLUMN "price_monthly" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "price_daily"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD COLUMN "price_daily" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "discount_yearly_type"`);
        await queryRunner.query(`DROP TYPE "public"."villas_discount_yearly_type_enum"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "discount_monthly_type"`);
        await queryRunner.query(`DROP TYPE "public"."villas_discount_monthly_type_enum"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "discount_daily_type"`);
        await queryRunner.query(`DROP TYPE "public"."villas_discount_daily_type_enum"`);
        await queryRunner.query(`ALTER TABLE "property_facility_pivot" DROP COLUMN "include_description"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "property_id"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "activity_id"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_per_session_after_discount","lind_society_dev","public","activities"]);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "price_per_session_after_discount"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_per_person_after_discount","lind_society_dev","public","activities"]);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "price_per_person_after_discount"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "discount"`);
        await queryRunner.query(`ALTER TABLE "activities" ADD COLUMN "discount" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "price_per_session"`);
        await queryRunner.query(`ALTER TABLE "activities" ADD COLUMN "price_per_session" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "price_per_person"`);
        await queryRunner.query(`ALTER TABLE "activities" ADD COLUMN "price_per_person" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "discount_type"`);
        await queryRunner.query(`DROP TYPE "public"."activities_discount_type_enum"`);
        await queryRunner.query(`ALTER TABLE "features" ADD "list" text`);
    }

}
