import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1743488954076 implements MigrationInterface {
    name = 'Migration1743488954076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP CONSTRAINT "FK_fdf05d91b1e998a6b8179f11434"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP COLUMN "bookingId"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "activity_id" uuid`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "villa_id" uuid`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD CONSTRAINT "FK_afaa5733b05d8844072d5107eae" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_9a8da83eb74b4ced2d34c562aa3" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_7598dc2fefd73433353e760ec68" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_7598dc2fefd73433353e760ec68"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_9a8da83eb74b4ced2d34c562aa3"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP CONSTRAINT "FK_afaa5733b05d8844072d5107eae"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "villa_id"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "activity_id"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD "bookingId" uuid`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD CONSTRAINT "FK_fdf05d91b1e998a6b8179f11434" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
