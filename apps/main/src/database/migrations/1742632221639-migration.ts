import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742632221639 implements MigrationInterface {
    name = 'Migration1742632221639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currencies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character(3) NOT NULL, "name" character varying NOT NULL, "symbol" character varying(5), "allow_decimal" boolean DEFAULT true, "allow_round" boolean DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_9f8d0972aeeb5a2277e40332d29" UNIQUE ("code"), CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "villa_additional_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "villa_id" uuid NOT NULL, "additional_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_f5c086b1d335ff5d6ff14da798f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "additionals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "name" character varying NOT NULL, "description" text, "photos" character varying array, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_96a84f18fd542f166df3940c69e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property_additional_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "additional_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b5b8ff1d8059f492037b5622532" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "villa_facility_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "villa_id" uuid NOT NULL, "facility_id" uuid NOT NULL, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_aa3382a76a186107527c8f1586e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."facilities_type_enum" AS ENUM('main', 'optional')`);
        await queryRunner.query(`CREATE TABLE "facilities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "icon" jsonb, "type" "public"."facilities_type_enum" NOT NULL DEFAULT 'optional', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2e6c685b2e1195e6d6394a22bc7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property_facility_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "facility_id" uuid NOT NULL, "include_description" boolean NOT NULL DEFAULT false, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_4929b2caea3ee2d2746638c7865" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "villa_feature_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "villa_id" uuid NOT NULL, "feature_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b62ca6bc7c720af1eb99173f8bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."discount_type_enum" AS ENUM('percentage', 'fixed')`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","features","GENERATED_COLUMN","price_after_discount","\n        CASE \n          WHEN discount_type = 'fixed' THEN \n            GREATEST(price - COALESCE(discount, 0), 0)\n          ELSE \n            GREATEST(price - (price * COALESCE(discount, 0) / 100), 0)\n        END\n      "]);
        await queryRunner.query(`CREATE TABLE "features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "name" character varying NOT NULL, "icon" jsonb, "free" boolean NOT NULL, "currency_id" uuid, "price" numeric(15,2), "discount_type" "public"."discount_type_enum", "discount" numeric(15,2), "price_after_discount" numeric(15,2) GENERATED ALWAYS AS (
        CASE 
          WHEN discount_type = 'fixed' THEN 
            GREATEST(price - COALESCE(discount, 0), 0)
          ELSE 
            GREATEST(price - (price * COALESCE(discount, 0) / 100), 0)
        END
      ) STORED, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5c1e336df2f4a7051e5bf08a941" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property_feature_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "feature_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9a2afffcd1b0fcdf94e51dcd743" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_1f9eb88f32fdc6450a65d28b5fb" UNIQUE ("name"), CONSTRAINT "PK_8cc7b00daa0d770af779497e32c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."activities_duration_enum" AS ENUM('temporary', 'permanent')`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","activities","GENERATED_COLUMN","price_per_person_after_discount","\n      CASE \n        WHEN discount_type = 'fixed' THEN \n          GREATEST(price_per_person - COALESCE(discount, 0), 0)\n        ELSE \n          GREATEST(price_per_person - (price_per_person * COALESCE(discount, 0) / 100), 0)\n      END\n    "]);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","activities","GENERATED_COLUMN","price_per_session_after_discount","\n      CASE \n        WHEN discount_type = 'fixed' THEN \n          GREATEST(price_per_session - COALESCE(discount, 0), 0)\n        ELSE \n          GREATEST(price_per_session - (price_per_session * COALESCE(discount, 0) / 100), 0)\n      END\n    "]);
        await queryRunner.query(`CREATE TABLE "activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "secondary_name" character varying, "highlight" text, "price_per_person" numeric(15,2), "price_per_session" numeric(15,2), "discount_type" "public"."discount_type_enum", "discount" numeric(15,2), "price_per_person_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_type = 'fixed' THEN 
          GREATEST(price_per_person - COALESCE(discount, 0), 0)
        ELSE 
          GREATEST(price_per_person - (price_per_person * COALESCE(discount, 0) / 100), 0)
      END
    ) STORED, "price_per_session_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_type = 'fixed' THEN 
          GREATEST(price_per_session - COALESCE(discount, 0), 0)
        ELSE 
          GREATEST(price_per_session - (price_per_session * COALESCE(discount, 0) / 100), 0)
      END
    ) STORED, "duration" "public"."activities_duration_enum" NOT NULL, "address" character varying, "country" character varying, "state" character varying, "city" character varying, "postal_code" character varying, "map_link" character varying, "place_nearby" jsonb, "opening_hour" TIME(0) NOT NULL, "closing_hour" TIME(0) NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE, "end_date" TIMESTAMP WITH TIME ZONE, "photos" character varying array, "videos" character varying array, "video_360" character varying array, "category_id" uuid NOT NULL, "currency_id" uuid NOT NULL, "owner_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "country" character varying, "check_in" TIMESTAMP WITH TIME ZONE, "check_out" TIMESTAMP WITH TIME ZONE, "rating" numeric(5,2) NOT NULL, "message" text NOT NULL, "booking_id" uuid, "activity_id" uuid, "property_id" uuid, "villa_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."properties_ownership_type_enum" AS ENUM('leasehold', 'freehold')`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","properties","GENERATED_COLUMN","price_after_discount","\n      CASE \n        WHEN discount_type = 'fixed' THEN \n          GREATEST(price - COALESCE(discount, 0), 0)\n        ELSE \n          GREATEST(price - (price * COALESCE(discount, 0) / 100), 0)\n      END\n    "]);
        await queryRunner.query(`CREATE TABLE "properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "secondary_name" character varying, "price" numeric(15,2), "discount_type" "public"."discount_type_enum", "discount" numeric(15,2), "price_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_type = 'fixed' THEN 
          GREATEST(price - COALESCE(discount, 0), 0)
        ELSE 
          GREATEST(price - (price * COALESCE(discount, 0) / 100), 0)
      END
    ) STORED, "ownership_type" "public"."properties_ownership_type_enum" NOT NULL, "highlight" text, "address" character varying, "country" character varying, "state" character varying, "city" character varying, "postal_code" character varying, "map_link" character varying, "place_nearby" jsonb, "photos" character varying array, "videos" character varying array, "video_360" character varying array, "sold_status" boolean NOT NULL DEFAULT false, "currency_id" uuid NOT NULL, "owner_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."owners_type_enum" AS ENUM('private', 'company')`);
        await queryRunner.query(`CREATE TYPE "public"."owners_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "owners" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."owners_type_enum" NOT NULL, "company_name" character varying, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "address" character varying NOT NULL, "website" character varying, "status" "public"."owners_status_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_42838282f2e6b216301a70b02d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."villas_availability_enum" AS ENUM('daily', 'monthly', 'yearly')`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_daily_after_discount","\n      CASE \n        WHEN discount_daily_type = 'fixed' THEN \n          GREATEST(price_daily - COALESCE(discount_daily, 0), 0)\n        ELSE \n          GREATEST(price_daily - (price_daily * COALESCE(discount_daily, 0) / 100), 0)\n      END\n    "]);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_monthly_after_discount","\n      CASE \n        WHEN discount_monthly_type = 'fixed' THEN \n          GREATEST(price_monthly - COALESCE(discount_monthly, 0), 0)\n        ELSE \n          GREATEST(price_monthly - (price_monthly * COALESCE(discount_monthly, 0) / 100), 0)\n      END\n    "]);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_yearly_after_discount","\n      CASE \n        WHEN discount_yearly_type = 'fixed' THEN \n          GREATEST(price_yearly - COALESCE(discount_yearly, 0), 0)\n        ELSE \n          GREATEST(price_yearly - (price_yearly * COALESCE(discount_yearly, 0) / 100), 0)\n      END\n    "]);
        await queryRunner.query(`CREATE TABLE "villas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "secondary_name" character varying, "availability" "public"."villas_availability_enum" array, "price_daily" numeric(15,2), "price_monthly" numeric(15,2), "price_yearly" numeric(15,2), "discount_daily_type" "public"."discount_type_enum", "discount_monthly_type" "public"."discount_type_enum", "discount_yearly_type" "public"."discount_type_enum", "discount_daily" numeric(15,2), "discount_monthly" numeric(15,2), "discount_yearly" numeric(15,2), "price_daily_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_daily_type = 'fixed' THEN 
          GREATEST(price_daily - COALESCE(discount_daily, 0), 0)
        ELSE 
          GREATEST(price_daily - (price_daily * COALESCE(discount_daily, 0) / 100), 0)
      END
    ) STORED, "price_monthly_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_monthly_type = 'fixed' THEN 
          GREATEST(price_monthly - COALESCE(discount_monthly, 0), 0)
        ELSE 
          GREATEST(price_monthly - (price_monthly * COALESCE(discount_monthly, 0) / 100), 0)
      END
    ) STORED, "price_yearly_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_yearly_type = 'fixed' THEN 
          GREATEST(price_yearly - COALESCE(discount_yearly, 0), 0)
        ELSE 
          GREATEST(price_yearly - (price_yearly * COALESCE(discount_yearly, 0) / 100), 0)
      END
    ) STORED, "availability_per_price" jsonb, "highlight" text, "address" character varying, "country" character varying, "state" character varying, "city" character varying, "postal_code" character varying, "map_link" character varying, "place_nearby" jsonb, "check_in_hour" TIME(0) NOT NULL, "check_out_hour" TIME(0) NOT NULL, "photos" character varying array, "videos" character varying array, "video_360" character varying array, "currency_id" uuid NOT NULL, "owner_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_1e8ef3740bc60f246e518685a6c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "villa_policy_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "villa_id" uuid NOT NULL, "policy_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_8fb51dfd990a8533436b736780c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."villa_policies_type_enum" AS ENUM('house rules', 'payment terms')`);
        await queryRunner.query(`CREATE TABLE "villa_policies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."villa_policies_type_enum" NOT NULL, "description" text, "icon" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2fc68d3762a4d8f3a3e8c42db9c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "currency_converters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "base_currency_id" uuid, "target_currency_id" uuid, "exchange_rate" numeric(20,15) NOT NULL, "description" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_d1a06685bb6b91ee7899f5d515c" UNIQUE ("base_currency_id", "target_currency_id"), CONSTRAINT "PK_a453bdfff95656c647cda75af65" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone_number" character varying NOT NULL, "refresh_token" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_4ba6d0c734d53f8e1b2e24b6c56" UNIQUE ("username"), CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email"), CONSTRAINT "UQ_3a22cd242f3c1fbafa7840a4aaa" UNIQUE ("phone_number"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_adc3bc773ccf2fb6f073193fcf6" UNIQUE ("name"), CONSTRAINT "PK_1056d6faca26b9957f5d26e6572" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blogs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" text NOT NULL, "author_id" uuid NOT NULL, "category_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "villa_additional_pivot" ADD CONSTRAINT "FK_45852300b4269859081401adc9a" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_additional_pivot" ADD CONSTRAINT "FK_0abee967ac7acfae85b411dbeac" FOREIGN KEY ("additional_id") REFERENCES "additionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" ADD CONSTRAINT "FK_c0697048e5bee34e6c08cab0110" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" ADD CONSTRAINT "FK_90ba101c688b74ee2f4665b5845" FOREIGN KEY ("additional_id") REFERENCES "additionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_facility_pivot" ADD CONSTRAINT "FK_7088c179d55a66540bd62b082c1" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_facility_pivot" ADD CONSTRAINT "FK_20414033b754f4a455ce30668ba" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_facility_pivot" ADD CONSTRAINT "FK_04a2b295fbc98ec49cae90f5841" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_facility_pivot" ADD CONSTRAINT "FK_1e04be5ffec1f31c2b16a3b31c2" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_feature_pivot" ADD CONSTRAINT "FK_ed65714ee42b3c27cfa03aa6ae3" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_feature_pivot" ADD CONSTRAINT "FK_21d8648bdafda0ce62d747472af" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "features" ADD CONSTRAINT "FK_b6eb8eba957d275eb734c8e2a8f" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_feature_pivot" ADD CONSTRAINT "FK_4bcfba3b42a739c3b738fc93904" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_feature_pivot" ADD CONSTRAINT "FK_7de18df96af6bdd94b612d4c945" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_cf4a8062ad267056ddd5f867ac1" FOREIGN KEY ("category_id") REFERENCES "activity_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_07565d0599b9f287ad6cce803bf" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_5546fd6565cf2441fc400728014" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_f685cc6413eef0ae1dcfb44251a" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_2b1e1cd13649e9315b28b7f2f0c" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_98cfb49d975b69cc0acaa73b7e7" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_8cb7e7d74ffde68e408437f4652" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_797b76e2d11a5bf755127d1aa67" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villas" ADD CONSTRAINT "FK_2e73f202b87de20927733ddc7e3" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villas" ADD CONSTRAINT "FK_5e8879457aa2d5ef9d6e0397c9c" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_policy_pivot" ADD CONSTRAINT "FK_1d1021eaa0ffe112983929db348" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_policy_pivot" ADD CONSTRAINT "FK_72bfed6a6293b14f47d723e1484" FOREIGN KEY ("policy_id") REFERENCES "villa_policies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "currency_converters" ADD CONSTRAINT "FK_601ba3ddaedc8488639d06343e3" FOREIGN KEY ("base_currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "currency_converters" ADD CONSTRAINT "FK_5aa2d1ccb1491f3a21e7c86e10c" FOREIGN KEY ("target_currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_b324119dcb71e877cee411f7929" FOREIGN KEY ("author_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_1f073a9f9720fe731423f1064cc" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_1f073a9f9720fe731423f1064cc"`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_b324119dcb71e877cee411f7929"`);
        await queryRunner.query(`ALTER TABLE "currency_converters" DROP CONSTRAINT "FK_5aa2d1ccb1491f3a21e7c86e10c"`);
        await queryRunner.query(`ALTER TABLE "currency_converters" DROP CONSTRAINT "FK_601ba3ddaedc8488639d06343e3"`);
        await queryRunner.query(`ALTER TABLE "villa_policy_pivot" DROP CONSTRAINT "FK_72bfed6a6293b14f47d723e1484"`);
        await queryRunner.query(`ALTER TABLE "villa_policy_pivot" DROP CONSTRAINT "FK_1d1021eaa0ffe112983929db348"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP CONSTRAINT "FK_5e8879457aa2d5ef9d6e0397c9c"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP CONSTRAINT "FK_2e73f202b87de20927733ddc7e3"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_797b76e2d11a5bf755127d1aa67"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_8cb7e7d74ffde68e408437f4652"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_98cfb49d975b69cc0acaa73b7e7"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_2b1e1cd13649e9315b28b7f2f0c"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_f685cc6413eef0ae1dcfb44251a"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_5546fd6565cf2441fc400728014"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_07565d0599b9f287ad6cce803bf"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_cf4a8062ad267056ddd5f867ac1"`);
        await queryRunner.query(`ALTER TABLE "property_feature_pivot" DROP CONSTRAINT "FK_7de18df96af6bdd94b612d4c945"`);
        await queryRunner.query(`ALTER TABLE "property_feature_pivot" DROP CONSTRAINT "FK_4bcfba3b42a739c3b738fc93904"`);
        await queryRunner.query(`ALTER TABLE "features" DROP CONSTRAINT "FK_b6eb8eba957d275eb734c8e2a8f"`);
        await queryRunner.query(`ALTER TABLE "villa_feature_pivot" DROP CONSTRAINT "FK_21d8648bdafda0ce62d747472af"`);
        await queryRunner.query(`ALTER TABLE "villa_feature_pivot" DROP CONSTRAINT "FK_ed65714ee42b3c27cfa03aa6ae3"`);
        await queryRunner.query(`ALTER TABLE "property_facility_pivot" DROP CONSTRAINT "FK_1e04be5ffec1f31c2b16a3b31c2"`);
        await queryRunner.query(`ALTER TABLE "property_facility_pivot" DROP CONSTRAINT "FK_04a2b295fbc98ec49cae90f5841"`);
        await queryRunner.query(`ALTER TABLE "villa_facility_pivot" DROP CONSTRAINT "FK_20414033b754f4a455ce30668ba"`);
        await queryRunner.query(`ALTER TABLE "villa_facility_pivot" DROP CONSTRAINT "FK_7088c179d55a66540bd62b082c1"`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" DROP CONSTRAINT "FK_90ba101c688b74ee2f4665b5845"`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" DROP CONSTRAINT "FK_c0697048e5bee34e6c08cab0110"`);
        await queryRunner.query(`ALTER TABLE "villa_additional_pivot" DROP CONSTRAINT "FK_0abee967ac7acfae85b411dbeac"`);
        await queryRunner.query(`ALTER TABLE "villa_additional_pivot" DROP CONSTRAINT "FK_45852300b4269859081401adc9a"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
        await queryRunner.query(`DROP TABLE "blog_categories"`);
        await queryRunner.query(`DROP TABLE "admins"`);
        await queryRunner.query(`DROP TABLE "currency_converters"`);
        await queryRunner.query(`DROP TABLE "villa_policies"`);
        await queryRunner.query(`DROP TYPE "public"."villa_policies_type_enum"`);
        await queryRunner.query(`DROP TABLE "villa_policy_pivot"`);
        await queryRunner.query(`DROP TABLE "villas"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_yearly_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_monthly_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_daily_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`DROP TYPE "public"."discount_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."villas_availability_enum"`);
        await queryRunner.query(`DROP TABLE "owners"`);
        await queryRunner.query(`DROP TYPE "public"."owners_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."owners_type_enum"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_after_discount","lind_society_dev","public","properties"]);
        await queryRunner.query(`DROP TYPE "public"."properties_ownership_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."discount_type_enum"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "activities"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_per_session_after_discount","lind_society_dev","public","activities"]);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_per_person_after_discount","lind_society_dev","public","activities"]);
        await queryRunner.query(`DROP TYPE "public"."activities_duration_enum"`);
        await queryRunner.query(`DROP TYPE "public"."discount_type_enum"`);
        await queryRunner.query(`DROP TABLE "activity_categories"`);
        await queryRunner.query(`DROP TABLE "property_feature_pivot"`);
        await queryRunner.query(`DROP TABLE "features"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_after_discount","lind_society_dev","public","features"]);
        await queryRunner.query(`DROP TYPE "public"."discount_type_enum"`);
        await queryRunner.query(`DROP TABLE "villa_feature_pivot"`);
        await queryRunner.query(`DROP TABLE "property_facility_pivot"`);
        await queryRunner.query(`DROP TABLE "facilities"`);
        await queryRunner.query(`DROP TYPE "public"."facilities_type_enum"`);
        await queryRunner.query(`DROP TABLE "villa_facility_pivot"`);
        await queryRunner.query(`DROP TABLE "property_additional_pivot"`);
        await queryRunner.query(`DROP TABLE "additionals"`);
        await queryRunner.query(`DROP TABLE "villa_additional_pivot"`);
        await queryRunner.query(`DROP TABLE "currencies"`);
    }

}
