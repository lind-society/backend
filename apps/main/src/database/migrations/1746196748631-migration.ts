import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1746196748631 implements MigrationInterface {
    name = 'Migration1746196748631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_ca4b9f0b13ad8dc66f07e9d8ce2"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ee309d160b63c855c9cab7d883"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ee309d160b63c855c9cab7d883" FOREIGN KEY ("activity_booking_id") REFERENCES "activity_bookings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_ca4b9f0b13ad8dc66f07e9d8ce2" FOREIGN KEY ("villa_booking_id") REFERENCES "villa_bookings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_ca4b9f0b13ad8dc66f07e9d8ce2"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ee309d160b63c855c9cab7d883"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ee309d160b63c855c9cab7d883" FOREIGN KEY ("activity_booking_id") REFERENCES "activity_bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_ca4b9f0b13ad8dc66f07e9d8ce2" FOREIGN KEY ("villa_booking_id") REFERENCES "villa_bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
