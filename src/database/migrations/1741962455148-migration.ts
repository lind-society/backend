import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1741962455148 implements MigrationInterface {
    name = 'Migration1741962455148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" ADD CONSTRAINT "UQ_4ba6d0c734d53f8e1b2e24b6c56" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "admins" ADD CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "admins" ADD CONSTRAINT "UQ_3a22cd242f3c1fbafa7840a4aaa" UNIQUE ("phone_number")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" DROP CONSTRAINT "UQ_3a22cd242f3c1fbafa7840a4aaa"`);
        await queryRunner.query(`ALTER TABLE "admins" DROP CONSTRAINT "UQ_051db7d37d478a69a7432df1479"`);
        await queryRunner.query(`ALTER TABLE "admins" DROP CONSTRAINT "UQ_4ba6d0c734d53f8e1b2e24b6c56"`);
    }

}
