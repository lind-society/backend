import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1743788882700 implements MigrationInterface {
    name = 'Migration1743788882700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "owners" ADD "phone_country_code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."properties_ownership_type_enum" RENAME TO "properties_ownership_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."properties_ownership_type_enum" AS ENUM('Leasehold', 'Freehold')`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "ownership_type" TYPE "public"."properties_ownership_type_enum" USING "ownership_type"::"text"::"public"."properties_ownership_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."properties_ownership_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."properties_ownership_type_enum_old" AS ENUM('leasehold', 'freehold')`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "ownership_type" TYPE "public"."properties_ownership_type_enum_old" USING "ownership_type"::"text"::"public"."properties_ownership_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."properties_ownership_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."properties_ownership_type_enum_old" RENAME TO "properties_ownership_type_enum"`);
        await queryRunner.query(`ALTER TABLE "owners" DROP COLUMN "phone_country_code"`);
    }

}
