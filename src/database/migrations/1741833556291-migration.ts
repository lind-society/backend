import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741833556291 implements MigrationInterface {
    name = 'Migration1741833556291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villa_policies" DROP COLUMN "list"`);
        await queryRunner.query(`CREATE TYPE "public"."villa_policies_type_enum" AS ENUM('house rules', 'payment terms')`);
        await queryRunner.query(`ALTER TABLE "villa_policies" ADD "type" "public"."villa_policies_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villa_policies" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villa_policies" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "villa_policies" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."villa_policies_type_enum"`);
        await queryRunner.query(`ALTER TABLE "villa_policies" ADD "list" character varying array`);
    }

}
