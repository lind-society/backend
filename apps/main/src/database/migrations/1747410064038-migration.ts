import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747410064038 implements MigrationInterface {
    name = 'Migration1747410064038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villa_price_rules" ADD "discount_type" "public"."discount_type_enum"`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" ADD "currency_id" uuid`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" ALTER COLUMN "discount" TYPE numeric(15,2)`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" ADD CONSTRAINT "FK_5c9962e1aa6b819dcf3a8deba01" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villa_price_rules" DROP CONSTRAINT "FK_5c9962e1aa6b819dcf3a8deba01"`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" ALTER COLUMN "discount" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" DROP COLUMN "currency_id"`);
        await queryRunner.query(`ALTER TABLE "villa_price_rules" DROP COLUMN "discount_type"`);
    }

}
