import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742397173048 implements MigrationInterface {
    name = 'Migration1742397173048'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currency_converters" ADD CONSTRAINT "UQ_d1a06685bb6b91ee7899f5d515c" UNIQUE ("base_currency_id", "target_currency_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currency_converters" DROP CONSTRAINT "UQ_d1a06685bb6b91ee7899f5d515c"`);
    }

}
