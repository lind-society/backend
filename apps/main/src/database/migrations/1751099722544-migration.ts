import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751099722544 implements MigrationInterface {
    name = 'Migration1751099722544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_ca4b9f0b13ad8dc66f07e9d8ce2"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ee309d160b63c855c9cab7d883"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP CONSTRAINT "FK_5c3f9775b35237386636e6fa810"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP CONSTRAINT "FK_3226d265af657df26bd0879f4de"`);
        await queryRunner.query(`ALTER TABLE "reviews" RENAME COLUMN "activity_booking_id" TO "booking_id"`);
        await queryRunner.query(`ALTER TABLE "reviews" RENAME CONSTRAINT "UQ_7ee309d160b63c855c9cab7d883" TO "UQ_bbd6ac6e3e6a8f8c6e0e8692d63"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP COLUMN "activity_booking_id"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP COLUMN "villa_booking_id"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD "booking_id" uuid`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_type_enum" AS ENUM('activity', 'villa')`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "type" "public"."bookings_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "booking_date" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "UQ_bbd6ac6e3e6a8f8c6e0e8692d63"`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "check_in_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "check_out_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."bookings_status_enum" RENAME TO "bookings_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_status_enum" AS ENUM('Pending', 'Confirmed', 'Completed', 'Requested', 'Negotiation', 'Waiting for Payment', 'Booked', 'Checked In', 'Done', 'Canceled')`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "status" TYPE "public"."bookings_status_enum" USING "status"::"text"::"public"."bookings_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "status" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_ca4b9f0b13ad8dc66f07e9d8ce2" FOREIGN KEY ("villa_booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD CONSTRAINT "FK_afaa5733b05d8844072d5107eae" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP CONSTRAINT "FK_afaa5733b05d8844072d5107eae"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_ca4b9f0b13ad8dc66f07e9d8ce2"`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_status_enum_old" AS ENUM('requested', 'negotiation', 'waiting for payment', 'booked', 'done', 'canceled')`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "status" TYPE "public"."bookings_status_enum_old" USING "status"::"text"::"public"."bookings_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."bookings_status_enum_old" RENAME TO "bookings_status_enum"`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "check_out_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "check_in_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "UQ_bbd6ac6e3e6a8f8c6e0e8692d63" UNIQUE ("booking_id")`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "booking_date"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_type_enum"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP COLUMN "booking_id"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD "villa_booking_id" uuid`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD "activity_booking_id" uuid`);
        await queryRunner.query(`ALTER TABLE "reviews" RENAME CONSTRAINT "UQ_bbd6ac6e3e6a8f8c6e0e8692d63" TO "UQ_7ee309d160b63c855c9cab7d883"`);
        await queryRunner.query(`ALTER TABLE "reviews" RENAME COLUMN "booking_id" TO "activity_booking_id"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD CONSTRAINT "FK_3226d265af657df26bd0879f4de" FOREIGN KEY ("activity_booking_id") REFERENCES "activity_bookings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD CONSTRAINT "FK_5c3f9775b35237386636e6fa810" FOREIGN KEY ("villa_booking_id") REFERENCES "villa_bookings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ee309d160b63c855c9cab7d883" FOREIGN KEY ("activity_booking_id") REFERENCES "activity_bookings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_ca4b9f0b13ad8dc66f07e9d8ce2" FOREIGN KEY ("villa_booking_id") REFERENCES "villa_bookings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
