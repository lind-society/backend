import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741746234838 implements MigrationInterface {
    name = 'Migration1741746234838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "villa_policies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "icon" character varying, "list" character varying array, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2fc68d3762a4d8f3a3e8c42db9c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "villa_facility_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "villa_id" uuid NOT NULL, "facility_id" uuid NOT NULL, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_aa3382a76a186107527c8f1586e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "villa_feature_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "villa_id" uuid NOT NULL, "feature_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b62ca6bc7c720af1eb99173f8bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "villa_additional_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "villa_id" uuid NOT NULL, "additional_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_f5c086b1d335ff5d6ff14da798f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."villas_availability_enum" AS ENUM('daily', 'monthly', 'yearly')`);
        await queryRunner.query(`CREATE TYPE "public"."villas_ownership_type_enum" AS ENUM('leasehold', 'freehold')`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_daily_after_discount","COALESCE(price_daily, 0) - (COALESCE(price_daily, 0) * COALESCE(discount_daily, 0) / 100)"]);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_monthly_after_discount","COALESCE(price_monthly, 0) - (COALESCE(price_monthly, 0) * COALESCE(discount_monthly, 0) / 100)"]);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_yearly_after_discount","COALESCE(price_yearly, 0) - (COALESCE(price_yearly, 0) * COALESCE(discount_yearly, 0) / 100)"]);
        await queryRunner.query(`CREATE TABLE "villas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "secondary_name" character varying, "availability" "public"."villas_availability_enum" array, "price_daily" numeric(10,2), "price_monthly" numeric(10,2), "price_yearly" numeric(10,2), "discount_daily" numeric(10,2), "discount_monthly" numeric(10,2), "discount_yearly" numeric(10,2), "price_daily_after_discount" numeric(10,2) GENERATED ALWAYS AS (COALESCE(price_daily, 0) - (COALESCE(price_daily, 0) * COALESCE(discount_daily, 0) / 100)) STORED, "price_monthly_after_discount" numeric(10,2) GENERATED ALWAYS AS (COALESCE(price_monthly, 0) - (COALESCE(price_monthly, 0) * COALESCE(discount_monthly, 0) / 100)) STORED, "price_yearly_after_discount" numeric(10,2) GENERATED ALWAYS AS (COALESCE(price_yearly, 0) - (COALESCE(price_yearly, 0) * COALESCE(discount_yearly, 0) / 100)) STORED, "availability_per_price" jsonb, "ownership_type" "public"."villas_ownership_type_enum" NOT NULL, "highlight" text, "address" character varying, "country" character varying, "state" character varying, "city" character varying, "postal_code" character varying, "map_link" character varying, "place_nearby" jsonb, "photos" character varying array, "videos" character varying array, "video_360" character varying array, "sold_status" boolean NOT NULL DEFAULT false, "owner_id" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_1e8ef3740bc60f246e518685a6c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "villa_policy_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "villa_id" uuid NOT NULL, "policy_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_8fb51dfd990a8533436b736780c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" ADD "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "villa_facility_pivot" ADD CONSTRAINT "FK_7088c179d55a66540bd62b082c1" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_facility_pivot" ADD CONSTRAINT "FK_20414033b754f4a455ce30668ba" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_feature_pivot" ADD CONSTRAINT "FK_ed65714ee42b3c27cfa03aa6ae3" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_feature_pivot" ADD CONSTRAINT "FK_21d8648bdafda0ce62d747472af" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_additional_pivot" ADD CONSTRAINT "FK_45852300b4269859081401adc9a" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_additional_pivot" ADD CONSTRAINT "FK_0abee967ac7acfae85b411dbeac" FOREIGN KEY ("additional_id") REFERENCES "additionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_policy_pivot" ADD CONSTRAINT "FK_1d1021eaa0ffe112983929db348" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_policy_pivot" ADD CONSTRAINT "FK_72bfed6a6293b14f47d723e1484" FOREIGN KEY ("policy_id") REFERENCES "villa_policies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villa_policy_pivot" DROP CONSTRAINT "FK_72bfed6a6293b14f47d723e1484"`);
        await queryRunner.query(`ALTER TABLE "villa_policy_pivot" DROP CONSTRAINT "FK_1d1021eaa0ffe112983929db348"`);
        await queryRunner.query(`ALTER TABLE "villa_additional_pivot" DROP CONSTRAINT "FK_0abee967ac7acfae85b411dbeac"`);
        await queryRunner.query(`ALTER TABLE "villa_additional_pivot" DROP CONSTRAINT "FK_45852300b4269859081401adc9a"`);
        await queryRunner.query(`ALTER TABLE "villa_feature_pivot" DROP CONSTRAINT "FK_21d8648bdafda0ce62d747472af"`);
        await queryRunner.query(`ALTER TABLE "villa_feature_pivot" DROP CONSTRAINT "FK_ed65714ee42b3c27cfa03aa6ae3"`);
        await queryRunner.query(`ALTER TABLE "villa_facility_pivot" DROP CONSTRAINT "FK_20414033b754f4a455ce30668ba"`);
        await queryRunner.query(`ALTER TABLE "villa_facility_pivot" DROP CONSTRAINT "FK_7088c179d55a66540bd62b082c1"`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" DROP COLUMN "created_at"`);
        await queryRunner.query(`DROP TABLE "villa_policy_pivot"`);
        await queryRunner.query(`DROP TABLE "villas"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_yearly_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_monthly_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_daily_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`DROP TYPE "public"."villas_ownership_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."villas_availability_enum"`);
        await queryRunner.query(`DROP TABLE "villa_additional_pivot"`);
        await queryRunner.query(`DROP TABLE "villa_feature_pivot"`);
        await queryRunner.query(`DROP TABLE "villa_facility_pivot"`);
        await queryRunner.query(`DROP TABLE "villa_policies"`);
    }

}
