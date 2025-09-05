import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1755701799005 implements MigrationInterface {
    name = 'Migration1755701799005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "activity_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_1f9eb88f32fdc6450a65d28b5fb" UNIQUE ("name"), CONSTRAINT "PK_8cc7b00daa0d770af779497e32c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "currencies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character(3) NOT NULL, "name" character varying NOT NULL, "symbol" character varying(5), "allow_decimal" boolean DEFAULT true, "allow_round" boolean DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_9f8d0972aeeb5a2277e40332d29" UNIQUE ("code"), CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "villa_additional_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "villa_id" uuid NOT NULL, "additional_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_f5c086b1d335ff5d6ff14da798f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."additionals_type_enum" AS ENUM('bedrooms', 'indoor_areas', 'outdoor_areas', 'more_pictures')`);
        await queryRunner.query(`CREATE TABLE "additionals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."additionals_type_enum" NOT NULL, "name" character varying NOT NULL, "description" text, "photos" character varying array, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_96a84f18fd542f166df3940c69e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property_additional_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "additional_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b5b8ff1d8059f492037b5622532" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "villa_facility_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "villa_id" uuid NOT NULL, "facility_id" uuid NOT NULL, "include_description" boolean NOT NULL DEFAULT false, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_aa3382a76a186107527c8f1586e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."facilities_type_enum" AS ENUM('main', 'optional')`);
        await queryRunner.query(`CREATE TABLE "facilities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "icon" jsonb, "type" "public"."facilities_type_enum" NOT NULL DEFAULT 'optional', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_06bcfef94e04a223a5c46921932" UNIQUE ("name"), CONSTRAINT "PK_2e6c685b2e1195e6d6394a22bc7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property_facility_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "facility_id" uuid NOT NULL, "include_description" boolean NOT NULL DEFAULT false, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_4929b2caea3ee2d2746638c7865" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "villa_feature_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "villa_id" uuid NOT NULL, "feature_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b62ca6bc7c720af1eb99173f8bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."features_discount_type_enum" AS ENUM('percentage', 'fixed')`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","features","GENERATED_COLUMN","price_after_discount","\n        CASE \n          WHEN discount_type = 'fixed' THEN \n            GREATEST(price - COALESCE(discount, 0), 0)\n          ELSE \n            GREATEST(price - (price * COALESCE(discount, 0) / 100), 0)\n        END\n      "]);
        await queryRunner.query(`CREATE TABLE "features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "name" character varying NOT NULL, "icon" jsonb, "free" boolean NOT NULL, "currency_id" uuid, "price" numeric(15,2), "discount_type" "public"."features_discount_type_enum", "discount" numeric(15,2), "price_after_discount" numeric(15,2) GENERATED ALWAYS AS (
        CASE 
          WHEN discount_type = 'fixed' THEN 
            GREATEST(price - COALESCE(discount, 0), 0)
          ELSE 
            GREATEST(price - (price * COALESCE(discount, 0) / 100), 0)
        END
      ) STORED, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5c1e336df2f4a7051e5bf08a941" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property_feature_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "feature_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9a2afffcd1b0fcdf94e51dcd743" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."properties_discount_type_enum" AS ENUM('percentage', 'fixed')`);
        await queryRunner.query(`CREATE TYPE "public"."properties_ownership_type_enum" AS ENUM('leasehold', 'freehold')`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","properties","GENERATED_COLUMN","price_after_discount","\n      CASE \n        WHEN discount_type = 'fixed' THEN \n          GREATEST(price - COALESCE(discount, 0), 0)\n        ELSE \n          GREATEST(price - (price * COALESCE(discount, 0) / 100), 0)\n      END\n    "]);
        await queryRunner.query(`CREATE TABLE "properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "secondary_name" character varying NOT NULL, "price" numeric(15,2) NOT NULL, "discount_type" "public"."properties_discount_type_enum", "discount" numeric(15,2), "price_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_type = 'fixed' THEN 
          GREATEST(price - COALESCE(discount, 0), 0)
        ELSE 
          GREATEST(price - (price * COALESCE(discount, 0) / 100), 0)
      END
    ) STORED, "ownership_type" "public"."properties_ownership_type_enum" NOT NULL, "highlight" text NOT NULL, "address" character varying NOT NULL, "country" character varying NOT NULL, "state" character varying NOT NULL, "city" character varying NOT NULL, "postal_code" character varying NOT NULL, "map_link" character varying NOT NULL, "place_nearby" jsonb, "photos" text array NOT NULL, "videos" text array, "video_360" text array, "floor_plans" text array, "sold_status" boolean NOT NULL DEFAULT false, "is_favorite" boolean DEFAULT false, "currency_id" uuid, "owner_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."owners_type_enum" AS ENUM('private', 'company')`);
        await queryRunner.query(`CREATE TYPE "public"."owners_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "owners" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."owners_type_enum" NOT NULL, "company_name" character varying NOT NULL, "email" character varying NOT NULL, "phone_country_code" character varying NOT NULL, "phone_number" character varying NOT NULL, "address" character varying NOT NULL, "website" character varying, "status" "public"."owners_status_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_42838282f2e6b216301a70b02d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" numeric(5,2) NOT NULL, "message" text NOT NULL, "booking_id" uuid, "activity_id" uuid, "villa_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "villa_booking_id" uuid, CONSTRAINT "REL_ca4b9f0b13ad8dc66f07e9d8ce" UNIQUE ("villa_booking_id"), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."activities_discount_type_enum" AS ENUM('percentage', 'fixed')`);
        await queryRunner.query(`CREATE TYPE "public"."activities_duration_enum" AS ENUM('temporary', 'permanent')`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","activities","GENERATED_COLUMN","price_after_discount","\n      CASE \n        WHEN discount_type = 'fixed' THEN \n          GREATEST(price - COALESCE(discount, 0), 0)\n        ELSE \n          GREATEST(price - (price * COALESCE(discount, 0) / 100), 0)\n      END\n    "]);
        await queryRunner.query(`CREATE TABLE "activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "secondary_name" character varying NOT NULL, "highlight" text NOT NULL, "price" numeric(15,2) NOT NULL, "discount_type" "public"."activities_discount_type_enum", "discount" numeric(15,2), "price_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_type = 'fixed' THEN 
          GREATEST(price - COALESCE(discount, 0), 0)
        ELSE 
          GREATEST(price - (price * COALESCE(discount, 0) / 100), 0)
      END
    ) STORED, "duration" "public"."activities_duration_enum" NOT NULL, "address" character varying NOT NULL, "country" character varying NOT NULL, "state" character varying NOT NULL, "city" character varying NOT NULL, "postal_code" character varying NOT NULL, "map_link" character varying NOT NULL, "place_nearby" jsonb, "opening_hour" TIME(0) NOT NULL, "closing_hour" TIME(0) NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE, "end_date" TIMESTAMP WITH TIME ZONE, "daily_limit" integer NOT NULL, "photos" text array NOT NULL, "videos" text array, "video_360" text array, "floor_plans" text array, "average_rating" numeric(5,2) NOT NULL DEFAULT '0', "total_review" integer NOT NULL DEFAULT '0', "is_favorite" boolean DEFAULT false, "category_id" uuid, "currency_id" uuid, "owner_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "booking_customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "phone_country_code" character varying NOT NULL, "phone_number" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_8636c5570eab54dd71e73d4edd9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."booking_payment_refunds_status_enum" AS ENUM('succeeded', 'failed', 'pending', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "booking_payment_refunds" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(15,2), "refunded_reason" character varying NOT NULL, "status" "public"."booking_payment_refunds_status_enum" NOT NULL, "failure_reason" character varying, "currency_id" uuid NOT NULL, "booking_payment_id" uuid NOT NULL, "payment_refund_request_reference_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_3d8d40005409d8805d371e65b1f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."booking_payments_status_enum" AS ENUM('requires_action', 'active', 'pending', 'paid', 'expired', 'authorized', 'waiting_for_refund', 'refunded', 'cancelled', 'failed')`);
        await queryRunner.query(`CREATE TYPE "public"."booking_payments_failure_stage_enum" AS ENUM('create_payment_invoice', 'pay_payment_invoice', 'create_payment_request', 'pay_payment_request', 'cancel_payment_request', 'create_payment_session', 'pay_payment_session', 'cancel_payment_session', 'payment_refund_request', 'payment_refund_result', 'cancel_payment', 'capture_payment', 'create_payment_token', 'payment_token_activation')`);
        await queryRunner.query(`CREATE TABLE "booking_payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "payment_method" character varying, "payment_channel" character varying, "amount" numeric(15,2), "status" "public"."booking_payments_status_enum", "paid_at" TIMESTAMP WITH TIME ZONE, "refunded_at" TIMESTAMP WITH TIME ZONE, "cancelled_at" TIMESTAMP WITH TIME ZONE, "failure_stage" "public"."booking_payments_failure_stage_enum", "failure_reason" character varying, "refunded_amount" numeric(15,2), "refunded_reason" character varying, "cancelled_reason" character varying, "payment_reference_id" character varying, "payment_request_reference_id" character varying, "payment_session_reference_id" character varying, "payment_token_reference_id" character varying, "payment_refund_reference_id" character varying, "currency_id" uuid NOT NULL, "booking_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_4f54ffc7dfddb70234fb53a97a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_type_enum" AS ENUM('activity', 'villa')`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_status_enum" AS ENUM('pending', 'confirmed', 'completed', 'requested', 'negotiation', 'waiting_for_payment', 'booked', 'checked_in', 'done', 'canceled')`);
        await queryRunner.query(`CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."bookings_type_enum" NOT NULL, "total_guest" integer NOT NULL, "total_amount" numeric(15,2) NOT NULL, "booking_date" TIMESTAMP WITH TIME ZONE, "check_in_date" TIMESTAMP WITH TIME ZONE, "check_out_date" TIMESTAMP WITH TIME ZONE, "status" "public"."bookings_status_enum", "currency_id" uuid NOT NULL, "customer_id" uuid NOT NULL, "activity_id" uuid, "villa_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "villa_policy_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_6798e92bdebd3dea0764a57a65b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "villa_policies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type_id" uuid NOT NULL, "description" text, "icon" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2fc68d3762a4d8f3a3e8c42db9c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "villa_policy_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "villa_id" uuid NOT NULL, "policy_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_8fb51dfd990a8533436b736780c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."villa_price_rules_season_enum" AS ENUM('regular_season', 'low_season', 'high_season', 'peak_season')`);
        await queryRunner.query(`CREATE TYPE "public"."villa_price_rules_discount_type_enum" AS ENUM('percentage', 'fixed')`);
        await queryRunner.query(`CREATE TABLE "villa_price_rules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "end_date" TIMESTAMP WITH TIME ZONE NOT NULL, "season" "public"."villa_price_rules_season_enum" NOT NULL, "is_discount" boolean NOT NULL DEFAULT false, "discount_type" "public"."villa_price_rules_discount_type_enum", "discount" numeric(15,2), "is_active" boolean NOT NULL DEFAULT true, "currency_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b404da045d21db6c1ca00da7ef9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "villa_price_rule_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "villa_id" uuid NOT NULL, "price_rule_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_71cd46be9f4f50af6dde9949488" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."discount_type_enum" AS ENUM('percentage', 'fixed')`);
        await queryRunner.query(`CREATE TYPE "public"."villas_discount_yearly_type_enum" AS ENUM('percentage', 'fixed')`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_monthly_after_discount","\n      CASE \n        WHEN discount_monthly_type = 'fixed' THEN \n          GREATEST(price_monthly - COALESCE(discount_monthly, 0), 0)\n        ELSE \n          GREATEST(price_monthly - (price_monthly * COALESCE(discount_monthly, 0) / 100), 0)\n      END\n    "]);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_yearly_after_discount","\n      CASE \n        WHEN discount_yearly_type = 'fixed' THEN \n          GREATEST(price_yearly - COALESCE(discount_yearly, 0), 0)\n        ELSE \n          GREATEST(price_yearly - (price_yearly * COALESCE(discount_yearly, 0) / 100), 0)\n      END\n    "]);
        await queryRunner.query(`CREATE TABLE "villas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "secondary_name" character varying NOT NULL, "availability" jsonb NOT NULL, "daily_price" numeric(15,2), "low_season_daily_price" numeric(15,2), "high_season_daily_price" numeric(15,2), "peak_season_daily_price" numeric(15,2), "daily_price_after_discount" numeric(15,2), "low_season_daily_price_after_discount" numeric(15,2), "high_season_daily_price_after_discount" numeric(15,2), "peak_season_daily_price_after_discount" numeric(15,2), "price_monthly" numeric(15,2), "price_yearly" numeric(15,2), "discount_monthly_type" "public"."discount_type_enum", "discount_yearly_type" "public"."villas_discount_yearly_type_enum", "discount_monthly" numeric(15,2), "discount_yearly" numeric(15,2), "price_monthly_after_discount" numeric(15,2) GENERATED ALWAYS AS (
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
    ) STORED, "availability_quota_per_month" integer, "availability_quota_per_year" integer, "highlight" text NOT NULL, "address" character varying NOT NULL, "country" character varying NOT NULL, "state" character varying NOT NULL, "city" character varying NOT NULL, "postal_code" character varying NOT NULL, "map_link" character varying NOT NULL, "place_nearby" jsonb, "check_in_hour" TIME(0) NOT NULL, "check_out_hour" TIME(0) NOT NULL, "photos" text array NOT NULL, "videos" text array, "video_360" text array, "floor_plans" text array, "average_rating" numeric(5,2) NOT NULL DEFAULT '0', "total_review" integer NOT NULL DEFAULT '0', "is_favorite" boolean DEFAULT false, "currency_id" uuid, "owner_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_1e8ef3740bc60f246e518685a6c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payment_channels_type_enum" AS ENUM('card', 'debit_card', 'credit_card', 'e_wallet', 'qr_code', 'qris', 'direct_debit', 'virtual_account', 'over_the_counter')`);
        await queryRunner.query(`CREATE TABLE "payment_channels" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "type" "public"."payment_channels_type_enum", "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_11f62faf142c430c06ba04a582c" UNIQUE ("code"), CONSTRAINT "PK_f55c8c32c7560a7efdeac5ccae1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "package_benefits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_dd41e3240693811c5740a3979b6" UNIQUE ("title"), CONSTRAINT "PK_0e3e2c54105fb87048728c747ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "package_benefit_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "package_id" uuid NOT NULL, "benefit_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_c1f03cc393c9b40e3ecd6ad6de5" UNIQUE ("package_id", "benefit_id"), CONSTRAINT "PK_5cc8f579518e0d7626932af4370" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "packages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_020801f620e21f943ead9311c98" PRIMARY KEY ("id"))`);
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
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_8cb7e7d74ffde68e408437f4652" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_797b76e2d11a5bf755127d1aa67" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_ca4b9f0b13ad8dc66f07e9d8ce2" FOREIGN KEY ("villa_booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_f685cc6413eef0ae1dcfb44251a" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_98cfb49d975b69cc0acaa73b7e7" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_cf4a8062ad267056ddd5f867ac1" FOREIGN KEY ("category_id") REFERENCES "activity_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_07565d0599b9f287ad6cce803bf" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_5546fd6565cf2441fc400728014" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_payment_refunds" ADD CONSTRAINT "FK_c2b36a811695a541b4c4302a019" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_payment_refunds" ADD CONSTRAINT "FK_2491b4cec0243c43b1d6d90a2c6" FOREIGN KEY ("booking_payment_id") REFERENCES "booking_payments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD CONSTRAINT "FK_afaa5733b05d8844072d5107eae" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD CONSTRAINT "FK_ed7bac501329c7f3c00722c988b" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_f960015e875a65b06cd17d6f791" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_8e21b7ae33e7b0673270de4146f" FOREIGN KEY ("customer_id") REFERENCES "booking_customers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_9a8da83eb74b4ced2d34c562aa3" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_7598dc2fefd73433353e760ec68" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_policies" ADD CONSTRAINT "FK_f979c1e1093fab5b7f09b20ea30" FOREIGN KEY ("type_id") REFERENCES "villa_policy_type"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_policy_pivot" ADD CONSTRAINT "FK_1d1021eaa0ffe112983929db348" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_policy_pivot" ADD CONSTRAINT "FK_72bfed6a6293b14f47d723e1484" FOREIGN KEY ("policy_id") REFERENCES "villa_policies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" ADD CONSTRAINT "FK_5c9962e1aa6b819dcf3a8deba01" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_price_rule_pivot" ADD CONSTRAINT "FK_4c34e7ae1a1b3f91d4ffc272dae" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_price_rule_pivot" ADD CONSTRAINT "FK_10cfa4efe6e535d353acf19f9f7" FOREIGN KEY ("price_rule_id") REFERENCES "villa_price_rules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villas" ADD CONSTRAINT "FK_2e73f202b87de20927733ddc7e3" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villas" ADD CONSTRAINT "FK_5e8879457aa2d5ef9d6e0397c9c" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "package_benefit_pivot" ADD CONSTRAINT "FK_391549139fe96c88cfd4c526851" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "package_benefit_pivot" ADD CONSTRAINT "FK_886c2389660ad4f0bcf24b7d858" FOREIGN KEY ("benefit_id") REFERENCES "package_benefits"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "currency_converters" ADD CONSTRAINT "FK_601ba3ddaedc8488639d06343e3" FOREIGN KEY ("base_currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "currency_converters" ADD CONSTRAINT "FK_5aa2d1ccb1491f3a21e7c86e10c" FOREIGN KEY ("target_currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_b324119dcb71e877cee411f7929" FOREIGN KEY ("author_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_1f073a9f9720fe731423f1064cc" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE VIEW "activities_view" AS 
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
    ON tb.activity_id = a.id;
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","activities_view","SELECT\n        a.*,\n        COALESCE(tb.total_today_booking, 0) AS total_today_booking\n    FROM\n        activities a\n    LEFT JOIN (\n        SELECT\n            b.activity_id,\n            COUNT(*) AS total_today_booking\n        FROM\n            bookings b\n        WHERE\n            b.status = 'completed'\n            AND b.booking_date >= date_trunc('day', now())\n            AND b.booking_date < date_trunc('day', now()) + interval '1 day'\n        GROUP BY\n            b.activity_id\n    ) tb\n    ON tb.activity_id = a.id;"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","activities_view","public"]);
        await queryRunner.query(`DROP VIEW "activities_view"`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_1f073a9f9720fe731423f1064cc"`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_b324119dcb71e877cee411f7929"`);
        await queryRunner.query(`ALTER TABLE "currency_converters" DROP CONSTRAINT "FK_5aa2d1ccb1491f3a21e7c86e10c"`);
        await queryRunner.query(`ALTER TABLE "currency_converters" DROP CONSTRAINT "FK_601ba3ddaedc8488639d06343e3"`);
        await queryRunner.query(`ALTER TABLE "package_benefit_pivot" DROP CONSTRAINT "FK_886c2389660ad4f0bcf24b7d858"`);
        await queryRunner.query(`ALTER TABLE "package_benefit_pivot" DROP CONSTRAINT "FK_391549139fe96c88cfd4c526851"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP CONSTRAINT "FK_5e8879457aa2d5ef9d6e0397c9c"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP CONSTRAINT "FK_2e73f202b87de20927733ddc7e3"`);
        await queryRunner.query(`ALTER TABLE "villa_price_rule_pivot" DROP CONSTRAINT "FK_10cfa4efe6e535d353acf19f9f7"`);
        await queryRunner.query(`ALTER TABLE "villa_price_rule_pivot" DROP CONSTRAINT "FK_4c34e7ae1a1b3f91d4ffc272dae"`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" DROP CONSTRAINT "FK_5c9962e1aa6b819dcf3a8deba01"`);
        await queryRunner.query(`ALTER TABLE "villa_policy_pivot" DROP CONSTRAINT "FK_72bfed6a6293b14f47d723e1484"`);
        await queryRunner.query(`ALTER TABLE "villa_policy_pivot" DROP CONSTRAINT "FK_1d1021eaa0ffe112983929db348"`);
        await queryRunner.query(`ALTER TABLE "villa_policies" DROP CONSTRAINT "FK_f979c1e1093fab5b7f09b20ea30"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_7598dc2fefd73433353e760ec68"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_9a8da83eb74b4ced2d34c562aa3"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_8e21b7ae33e7b0673270de4146f"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_f960015e875a65b06cd17d6f791"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP CONSTRAINT "FK_ed7bac501329c7f3c00722c988b"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP CONSTRAINT "FK_afaa5733b05d8844072d5107eae"`);
        await queryRunner.query(`ALTER TABLE "booking_payment_refunds" DROP CONSTRAINT "FK_2491b4cec0243c43b1d6d90a2c6"`);
        await queryRunner.query(`ALTER TABLE "booking_payment_refunds" DROP CONSTRAINT "FK_c2b36a811695a541b4c4302a019"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_5546fd6565cf2441fc400728014"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_07565d0599b9f287ad6cce803bf"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_cf4a8062ad267056ddd5f867ac1"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_98cfb49d975b69cc0acaa73b7e7"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_f685cc6413eef0ae1dcfb44251a"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_ca4b9f0b13ad8dc66f07e9d8ce2"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_797b76e2d11a5bf755127d1aa67"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_8cb7e7d74ffde68e408437f4652"`);
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
        await queryRunner.query(`DROP TABLE "packages"`);
        await queryRunner.query(`DROP TABLE "package_benefit_pivot"`);
        await queryRunner.query(`DROP TABLE "package_benefits"`);
        await queryRunner.query(`DROP TABLE "payment_channels"`);
        await queryRunner.query(`DROP TYPE "public"."payment_channels_type_enum"`);
        await queryRunner.query(`DROP TABLE "villas"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_yearly_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_monthly_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`DROP TYPE "public"."villas_discount_yearly_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."discount_type_enum"`);
        await queryRunner.query(`DROP TABLE "villa_price_rule_pivot"`);
        await queryRunner.query(`DROP TABLE "villa_price_rules"`);
        await queryRunner.query(`DROP TYPE "public"."villa_price_rules_discount_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."villa_price_rules_season_enum"`);
        await queryRunner.query(`DROP TABLE "villa_policy_pivot"`);
        await queryRunner.query(`DROP TABLE "villa_policies"`);
        await queryRunner.query(`DROP TABLE "villa_policy_type"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_type_enum"`);
        await queryRunner.query(`DROP TABLE "booking_payments"`);
        await queryRunner.query(`DROP TYPE "public"."booking_payments_failure_stage_enum"`);
        await queryRunner.query(`DROP TYPE "public"."booking_payments_status_enum"`);
        await queryRunner.query(`DROP TABLE "booking_payment_refunds"`);
        await queryRunner.query(`DROP TYPE "public"."booking_payment_refunds_status_enum"`);
        await queryRunner.query(`DROP TABLE "booking_customers"`);
        await queryRunner.query(`DROP TABLE "activities"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_after_discount","lind_society_dev","public","activities"]);
        await queryRunner.query(`DROP TYPE "public"."activities_duration_enum"`);
        await queryRunner.query(`DROP TYPE "public"."activities_discount_type_enum"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "owners"`);
        await queryRunner.query(`DROP TYPE "public"."owners_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."owners_type_enum"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_after_discount","lind_society_dev","public","properties"]);
        await queryRunner.query(`DROP TYPE "public"."properties_ownership_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."properties_discount_type_enum"`);
        await queryRunner.query(`DROP TABLE "property_feature_pivot"`);
        await queryRunner.query(`DROP TABLE "features"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_after_discount","lind_society_dev","public","features"]);
        await queryRunner.query(`DROP TYPE "public"."features_discount_type_enum"`);
        await queryRunner.query(`DROP TABLE "villa_feature_pivot"`);
        await queryRunner.query(`DROP TABLE "property_facility_pivot"`);
        await queryRunner.query(`DROP TABLE "facilities"`);
        await queryRunner.query(`DROP TYPE "public"."facilities_type_enum"`);
        await queryRunner.query(`DROP TABLE "villa_facility_pivot"`);
        await queryRunner.query(`DROP TABLE "property_additional_pivot"`);
        await queryRunner.query(`DROP TABLE "additionals"`);
        await queryRunner.query(`DROP TYPE "public"."additionals_type_enum"`);
        await queryRunner.query(`DROP TABLE "villa_additional_pivot"`);
        await queryRunner.query(`DROP TABLE "currencies"`);
        await queryRunner.query(`DROP TABLE "activity_categories"`);
    }

}
