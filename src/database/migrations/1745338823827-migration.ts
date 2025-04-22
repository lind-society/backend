import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745338823827 implements MigrationInterface {
    name = 'Migration1745338823827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "price_daily_after_discount"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","price_daily_after_discount","lind_society_dev","public","villas"]);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "base_price_daily"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "price_daily"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "discount_daily_type"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "discount_daily"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "floor_plan" text array`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "floor_plan" text array`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "daily_base_price" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "low_season_price_rate" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "high_season_price_rate" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "peak_season_price_rate" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "daily_base_price_after_season_rate" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "floor_plan" text array`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_8cb7e7d74ffde68e408437f4652"`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "secondary_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "highlight" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "country" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "state" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "city" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "postal_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "map_link" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "place_nearby" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "photos"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "photos" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "videos"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "videos" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "video_360"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "video_360" text array`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "currency_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_cf4a8062ad267056ddd5f867ac1"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_07565d0599b9f287ad6cce803bf"`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "secondary_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "highlight" SET NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."activities_duration_enum" RENAME TO "activities_duration_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."activities_duration_enum" AS ENUM('Temporary', 'Permanent')`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "duration" TYPE "public"."activities_duration_enum" USING "duration"::"text"::"public"."activities_duration_enum"`);
        await queryRunner.query(`DROP TYPE "public"."activities_duration_enum_old"`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "country" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "state" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "city" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "postal_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "map_link" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "place_nearby" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "photos"`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "photos" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "videos"`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "videos" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "video_360"`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "video_360" text array`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "category_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "currency_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" DROP CONSTRAINT "FK_2e73f202b87de20927733ddc7e3"`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "secondary_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "availability" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "highlight" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "country" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "state" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "city" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "postal_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "map_link" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "place_nearby" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "photos"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "photos" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "videos"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "videos" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "video_360"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "video_360" text array`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "currency_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_8cb7e7d74ffde68e408437f4652" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_cf4a8062ad267056ddd5f867ac1" FOREIGN KEY ("category_id") REFERENCES "activity_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_07565d0599b9f287ad6cce803bf" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villas" ADD CONSTRAINT "FK_2e73f202b87de20927733ddc7e3" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villas" DROP CONSTRAINT "FK_2e73f202b87de20927733ddc7e3"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_07565d0599b9f287ad6cce803bf"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_cf4a8062ad267056ddd5f867ac1"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_8cb7e7d74ffde68e408437f4652"`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "currency_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "video_360"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "video_360" character varying array`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "videos"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "videos" character varying array`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "photos"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "photos" character varying array`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "place_nearby" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "map_link" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "postal_code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "city" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "state" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "country" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "highlight" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "availability" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "secondary_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ADD CONSTRAINT "FK_2e73f202b87de20927733ddc7e3" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "currency_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "category_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "video_360"`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "video_360" character varying array`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "videos"`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "videos" character varying array`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "photos"`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "photos" character varying array`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "place_nearby" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "map_link" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "postal_code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "city" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "state" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "country" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "address" DROP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."activities_duration_enum_old" AS ENUM('temporary', 'permanent')`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "duration" TYPE "public"."activities_duration_enum_old" USING "duration"::"text"::"public"."activities_duration_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."activities_duration_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."activities_duration_enum_old" RENAME TO "activities_duration_enum"`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "highlight" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "secondary_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_07565d0599b9f287ad6cce803bf" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_cf4a8062ad267056ddd5f867ac1" FOREIGN KEY ("category_id") REFERENCES "activity_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "currency_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "video_360"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "video_360" character varying array`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "videos"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "videos" character varying array`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "photos"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "photos" character varying array`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "place_nearby" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "map_link" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "postal_code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "city" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "state" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "country" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "highlight" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "secondary_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_8cb7e7d74ffde68e408437f4652" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "floor_plan"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "daily_base_price_after_season_rate"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "peak_season_price_rate"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "high_season_price_rate"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "low_season_price_rate"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "daily_base_price"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "floor_plan"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "floor_plan"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "discount_daily" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "discount_daily_type" "public"."discount_type_enum"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "price_daily" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "base_price_daily" numeric(15,2)`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["lind_society_dev","public","villas","GENERATED_COLUMN","price_daily_after_discount","\n      CASE \n        WHEN discount_daily_type = 'fixed' THEN \n          GREATEST(price_daily - COALESCE(discount_daily, 0), 0)\n        ELSE \n          GREATEST(price_daily - (price_daily * COALESCE(discount_daily, 0) / 100), 0)\n      END\n    "]);
        await queryRunner.query(`ALTER TABLE "villas" ADD "price_daily_after_discount" numeric(15,2) GENERATED ALWAYS AS (
      CASE 
        WHEN discount_daily_type = 'fixed' THEN 
          GREATEST(price_daily - COALESCE(discount_daily, 0), 0)
        ELSE 
          GREATEST(price_daily - (price_daily * COALESCE(discount_daily, 0) / 100), 0)
      END
    ) STORED`);
    }

}
