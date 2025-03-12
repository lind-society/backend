import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741803933113 implements MigrationInterface {
    name = 'Migration1741803933113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."owners_type_enum" AS ENUM('private', 'company')`);
        await queryRunner.query(`CREATE TYPE "public"."owners_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "owners" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."owners_type_enum" NOT NULL, "company_name" character varying, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "address" character varying NOT NULL, "website" character varying, "status" "public"."owners_status_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_42838282f2e6b216301a70b02d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone_number" character varying NOT NULL, "refresh_token" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "owner_id" uuid`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "owner_id" uuid`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_797b76e2d11a5bf755127d1aa67" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villas" ADD CONSTRAINT "FK_5e8879457aa2d5ef9d6e0397c9c" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_b324119dcb71e877cee411f7929" FOREIGN KEY ("author_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_b324119dcb71e877cee411f7929"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP CONSTRAINT "FK_5e8879457aa2d5ef9d6e0397c9c"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_797b76e2d11a5bf755127d1aa67"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "owner_id" character varying`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "owner_id" character varying`);
        await queryRunner.query(`DROP TABLE "admins"`);
        await queryRunner.query(`DROP TABLE "owners"`);
        await queryRunner.query(`DROP TYPE "public"."owners_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."owners_type_enum"`);
    }

}
