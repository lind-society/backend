import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742062409420 implements MigrationInterface {
    name = 'Migration1742062409420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currencies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character(3) NOT NULL, "name" character varying NOT NULL, "symbol" character varying(5), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_9f8d0972aeeb5a2277e40332d29" UNIQUE ("code"), CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "currency_converters" DROP COLUMN "to"`);
        await queryRunner.query(`DROP TYPE "public"."currency_converters_to_enum"`);
        await queryRunner.query(`ALTER TABLE "currency_converters" DROP COLUMN "from"`);
        await queryRunner.query(`DROP TYPE "public"."currency_converters_from_enum"`);
        await queryRunner.query(`ALTER TABLE "currency_converters" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "currency_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "currency_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "currency_converters" ADD "base_currency_id" uuid`);
        await queryRunner.query(`ALTER TABLE "currency_converters" ADD "target_currency_id" uuid`);
        await queryRunner.query(`ALTER TABLE "currency_converters" ADD "exchange_rate" numeric(20,15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_b324119dcb71e877cee411f7929"`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_1f073a9f9720fe731423f1064cc"`);
        await queryRunner.query(`ALTER TABLE "blogs" ALTER COLUMN "author_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blogs" ALTER COLUMN "category_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_8cb7e7d74ffde68e408437f4652" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villas" ADD CONSTRAINT "FK_2e73f202b87de20927733ddc7e3" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE "villas" DROP CONSTRAINT "FK_2e73f202b87de20927733ddc7e3"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_8cb7e7d74ffde68e408437f4652"`);
        await queryRunner.query(`ALTER TABLE "blogs" ALTER COLUMN "category_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blogs" ALTER COLUMN "author_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_1f073a9f9720fe731423f1064cc" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_b324119dcb71e877cee411f7929" FOREIGN KEY ("author_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "currency_converters" DROP COLUMN "exchange_rate"`);
        await queryRunner.query(`ALTER TABLE "currency_converters" DROP COLUMN "target_currency_id"`);
        await queryRunner.query(`ALTER TABLE "currency_converters" DROP COLUMN "base_currency_id"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "currency_id"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "currency_id"`);
        await queryRunner.query(`ALTER TABLE "currency_converters" ADD "value" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."currency_converters_from_enum" AS ENUM('idr', 'usd')`);
        await queryRunner.query(`ALTER TABLE "currency_converters" ADD "from" "public"."currency_converters_from_enum" NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."currency_converters_to_enum" AS ENUM('idr', 'usd')`);
        await queryRunner.query(`ALTER TABLE "currency_converters" ADD "to" "public"."currency_converters_to_enum" NOT NULL`);
        await queryRunner.query(`DROP TABLE "currencies"`);
    }

}
