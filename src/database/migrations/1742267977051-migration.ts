import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742267977051 implements MigrationInterface {
    name = 'Migration1742267977051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "activity_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_1f9eb88f32fdc6450a65d28b5fb" UNIQUE ("name"), CONSTRAINT "PK_8cc7b00daa0d770af779497e32c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."activities_duration_enum" AS ENUM('temporary', 'permanent')`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","activities","GENERATED_COLUMN","price_per_person_after_discount","COALESCE(price_per_person, 0) - (COALESCE(price_per_person, 0) * COALESCE(discount, 0) / 100)"]);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","activities","GENERATED_COLUMN","price_per_session_after_discount","COALESCE(price_per_session, 0) - (COALESCE(price_per_session, 0) * COALESCE(discount, 0) / 100)"]);
        await queryRunner.query(`CREATE TABLE "activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "secondary_name" character varying, "highlight" text, "price_per_person" numeric(10,2), "price_per_session" numeric(10,2), "discount" numeric(10,2), "price_per_person_after_discount" numeric(10,2) GENERATED ALWAYS AS (COALESCE(price_per_person, 0) - (COALESCE(price_per_person, 0) * COALESCE(discount, 0) / 100)) STORED, "price_per_session_after_discount" numeric(10,2) GENERATED ALWAYS AS (COALESCE(price_per_session, 0) - (COALESCE(price_per_session, 0) * COALESCE(discount, 0) / 100)) STORED, "duration" "public"."activities_duration_enum" NOT NULL, "address" character varying, "country" character varying, "state" character varying, "city" character varying, "postal_code" character varying, "map_link" character varying, "place_nearby" jsonb, "opening_hour" TIME(0) NOT NULL, "closing_hour" TIME(0) NOT NULL, "photos" character varying array, "videos" character varying array, "video_360" character varying array, "start_date" TIMESTAMP WITH TIME ZONE, "end_date" TIMESTAMP WITH TIME ZONE, "category_id" uuid NOT NULL, "currency_id" uuid NOT NULL, "owner_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_cf4a8062ad267056ddd5f867ac1" FOREIGN KEY ("category_id") REFERENCES "activity_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_07565d0599b9f287ad6cce803bf" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_5546fd6565cf2441fc400728014" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_5546fd6565cf2441fc400728014"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_07565d0599b9f287ad6cce803bf"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_cf4a8062ad267056ddd5f867ac1"`);
        await queryRunner.query(`DROP TABLE "activities"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_per_session_after_discount","lind_society_dev","public","activities"]);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_per_person_after_discount","lind_society_dev","public","activities"]);
        await queryRunner.query(`DROP TYPE "public"."activities_duration_enum"`);
        await queryRunner.query(`DROP TABLE "activity_categories"`);
    }

}
