import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742130542109 implements MigrationInterface {
    name = 'Migration1742130542109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "features" RENAME COLUMN "price_currency" TO "currency_id"`);
        await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "currency_id"`);
        await queryRunner.query(`ALTER TABLE "features" ADD "currency_id" uuid`);
        await queryRunner.query(`ALTER TABLE "features" ADD CONSTRAINT "FK_b6eb8eba957d275eb734c8e2a8f" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "features" DROP CONSTRAINT "FK_b6eb8eba957d275eb734c8e2a8f"`);
        await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "currency_id"`);
        await queryRunner.query(`ALTER TABLE "features" ADD "currency_id" character varying`);
        await queryRunner.query(`ALTER TABLE "features" RENAME COLUMN "currency_id" TO "price_currency"`);
    }

}
