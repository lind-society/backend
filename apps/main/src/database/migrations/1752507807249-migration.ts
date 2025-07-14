import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1752507807249 implements MigrationInterface {
    name = 'Migration1752507807249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP COLUMN "paymentMethod"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD "payment_method" character varying`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD "payment_channel" character varying`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD "paid_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD "payment_reference_id" character varying`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ALTER COLUMN "status" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_payments" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP COLUMN "payment_reference_id"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP COLUMN "paid_at"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP COLUMN "payment_channel"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP COLUMN "payment_method"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD "paymentMethod" character varying NOT NULL`);
    }

}
