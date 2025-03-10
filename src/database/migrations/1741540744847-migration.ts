import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741540744847 implements MigrationInterface {
    name = 'Migration1741540744847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."additionals_type_enum" AS ENUM('bedrooms', 'indoor areas', 'outdoor areas', 'more pictures')`);
        await queryRunner.query(`CREATE TABLE "additionals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."additionals_type_enum" NOT NULL, "description" text, "photos" character varying array, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_96a84f18fd542f166df3940c69e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property_additional_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "additional_id" uuid NOT NULL,    CONSTRAINT "PK_b5b8ff1d8059f492037b5622532" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."facilities_type_enum" AS ENUM('main', 'optional')`);
        await queryRunner.query(`CREATE TABLE "facilities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "icon" character varying, "type" "public"."facilities_type_enum" NOT NULL DEFAULT 'optional', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2e6c685b2e1195e6d6394a22bc7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property_facility_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "facility_id" uuid NOT NULL, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_4929b2caea3ee2d2746638c7865" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "icon" character varying, "free" boolean NOT NULL, "price_currency" character varying, "price" numeric(10,2), "list" character varying array, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5c1e336df2f4a7051e5bf08a941" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property_feature_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "feature_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9a2afffcd1b0fcdf94e51dcd743" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."properties_ownership_type_enum" AS ENUM('leasehold', 'freehold')`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","properties","GENERATED_COLUMN","price_after_discount","COALESCE(price, 0) - (COALESCE(price, 0) * COALESCE(discount, 0) / 100)"]);
        await queryRunner.query(`CREATE TABLE "properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "secondary_name" character varying, "price" numeric(10,2), "discount" numeric(10,2), "price_after_discount" numeric(10,2) GENERATED ALWAYS AS (COALESCE(price, 0) - (COALESCE(price, 0) * COALESCE(discount, 0) / 100)) STORED, "ownership_type" "public"."properties_ownership_type_enum" NOT NULL, "highlight" text, "address" character varying, "country" character varying, "state" character varying, "city" character varying, "postal_code" character varying, "map_link" character varying, "place_nearby" jsonb, "photos" character varying array, "videos" character varying array, "video_360" character varying array, "sold_status" boolean NOT NULL DEFAULT false, "owner_id" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blogs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" text NOT NULL, "author_id" uuid, "category_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_adc3bc773ccf2fb6f073193fcf6" UNIQUE ("name"), CONSTRAINT "PK_1056d6faca26b9957f5d26e6572" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."currency_converters_from_enum" AS ENUM('idr', 'usd')`);
        await queryRunner.query(`CREATE TYPE "public"."currency_converters_to_enum" AS ENUM('idr', 'usd')`);
        await queryRunner.query(`CREATE TABLE "currency_converters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from" "public"."currency_converters_from_enum" NOT NULL, "to" "public"."currency_converters_to_enum" NOT NULL, "value" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a453bdfff95656c647cda75af65" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" ADD CONSTRAINT "FK_c0697048e5bee34e6c08cab0110" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" ADD CONSTRAINT "FK_90ba101c688b74ee2f4665b5845" FOREIGN KEY ("additional_id") REFERENCES "additionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_facility_pivot" ADD CONSTRAINT "FK_04a2b295fbc98ec49cae90f5841" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_facility_pivot" ADD CONSTRAINT "FK_1e04be5ffec1f31c2b16a3b31c2" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_feature_pivot" ADD CONSTRAINT "FK_4bcfba3b42a739c3b738fc93904" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_feature_pivot" ADD CONSTRAINT "FK_7de18df96af6bdd94b612d4c945" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_1f073a9f9720fe731423f1064cc" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_1f073a9f9720fe731423f1064cc"`);
        await queryRunner.query(`ALTER TABLE "property_feature_pivot" DROP CONSTRAINT "FK_7de18df96af6bdd94b612d4c945"`);
        await queryRunner.query(`ALTER TABLE "property_feature_pivot" DROP CONSTRAINT "FK_4bcfba3b42a739c3b738fc93904"`);
        await queryRunner.query(`ALTER TABLE "property_facility_pivot" DROP CONSTRAINT "FK_1e04be5ffec1f31c2b16a3b31c2"`);
        await queryRunner.query(`ALTER TABLE "property_facility_pivot" DROP CONSTRAINT "FK_04a2b295fbc98ec49cae90f5841"`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" DROP CONSTRAINT "FK_90ba101c688b74ee2f4665b5845"`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" DROP CONSTRAINT "FK_c0697048e5bee34e6c08cab0110"`);
        await queryRunner.query(`DROP TABLE "currency_converters"`);
        await queryRunner.query(`DROP TYPE "public"."currency_converters_to_enum"`);
        await queryRunner.query(`DROP TYPE "public"."currency_converters_from_enum"`);
        await queryRunner.query(`DROP TABLE "blog_categories"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_after_discount","lind_society_dev","public","properties"]);
        await queryRunner.query(`DROP TYPE "public"."properties_ownership_type_enum"`);
        await queryRunner.query(`DROP TABLE "property_feature_pivot"`);
        await queryRunner.query(`DROP TABLE "features"`);
        await queryRunner.query(`DROP TABLE "property_facility_pivot"`);
        await queryRunner.query(`DROP TABLE "facilities"`);
        await queryRunner.query(`DROP TYPE "public"."facilities_type_enum"`);
        await queryRunner.query(`DROP TABLE "property_additional_pivot"`);
        await queryRunner.query(`DROP TABLE "additionals"`);
        await queryRunner.query(`DROP TYPE "public"."additionals_type_enum"`);
    }

}
