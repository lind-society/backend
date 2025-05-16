import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747397134929 implements MigrationInterface {
    name = 'Migration1747397134929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villa_price_rules" DROP COLUMN "isDiscount"`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" ADD "is_discount" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" ADD "is_active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villa_price_rules" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" DROP COLUMN "is_discount"`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" ADD "isDiscount" boolean NOT NULL DEFAULT false`);
    }

}
