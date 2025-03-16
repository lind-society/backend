import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742113001184 implements MigrationInterface {
    name = 'Migration1742113001184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currencies" ADD "allow_decimal" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "currencies" ADD "allow_round" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currencies" DROP COLUMN "allow_round"`);
        await queryRunner.query(`ALTER TABLE "currencies" DROP COLUMN "allow_decimal"`);
    }

}
