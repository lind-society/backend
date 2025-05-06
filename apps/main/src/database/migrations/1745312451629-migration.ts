import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745312451629 implements MigrationInterface {
    name = 'Migration1745312451629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."price_rule_season_enum" AS ENUM('Low Season', 'Regular Season', 'High Season', 'Peak Season')`);
        await queryRunner.query(`CREATE TABLE "villa_price_rules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "start_date" TIMESTAMP WITH TIME ZONE, "end_date" TIMESTAMP WITH TIME ZONE, "price_rule_season" "public"."price_rule_season_enum", "isDiscount" boolean NOT NULL DEFAULT false, "discount" numeric(5,2), "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b404da045d21db6c1ca00da7ef9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "villa_price_rule_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "villa_id" uuid NOT NULL, "price_rule_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_71cd46be9f4f50af6dde9949488" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "base_price_daily" numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villa_price_rule_pivot" ADD CONSTRAINT "FK_4c34e7ae1a1b3f91d4ffc272dae" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_price_rule_pivot" ADD CONSTRAINT "FK_10cfa4efe6e535d353acf19f9f7" FOREIGN KEY ("price_rule_id") REFERENCES "villa_price_rules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villa_price_rule_pivot" DROP CONSTRAINT "FK_10cfa4efe6e535d353acf19f9f7"`);
        await queryRunner.query(`ALTER TABLE "villa_price_rule_pivot" DROP CONSTRAINT "FK_4c34e7ae1a1b3f91d4ffc272dae"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "base_price_daily"`);
        await queryRunner.query(`DROP TABLE "villa_price_rule_pivot"`);
        await queryRunner.query(`DROP TABLE "villa_price_rules"`);
        await queryRunner.query(`DROP TYPE "public"."price_rule_season_enum"`);
    }

}
