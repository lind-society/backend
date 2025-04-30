import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1744904541288 implements MigrationInterface {
    name = 'Migration1744904541288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "availability_per_price"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "availability_quota_per_month" integer`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "availability_quota_per_year" integer`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "availability"`);
        await queryRunner.query(`DROP TYPE "public"."villas_availability_enum"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "availability" jsonb`);
        await queryRunner.query(`ALTER TABLE "package_benefits" ADD CONSTRAINT "UQ_dd41e3240693811c5740a3979b6" UNIQUE ("title")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package_benefits" DROP CONSTRAINT "UQ_dd41e3240693811c5740a3979b6"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "availability"`);
        await queryRunner.query(`CREATE TYPE "public"."villas_availability_enum" AS ENUM('daily', 'monthly', 'yearly')`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "availability" "public"."villas_availability_enum" array`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "availability_quota_per_year"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "availability_quota_per_month"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "availability_per_price" jsonb`);
    }

}
