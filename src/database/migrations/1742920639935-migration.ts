import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742920639935 implements MigrationInterface {
    name = 'Migration1742920639935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "check_in"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "check_out"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "country"`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_status_enum" AS ENUM('requested', 'negotiation', 'waiting for payment', 'booked', 'done', 'canceled')`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "status" "public"."bookings_status_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "total_amount" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "check_in_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "check_out_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "booking_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "UQ_bbd6ac6e3e6a8f8c6e0e8692d63" UNIQUE ("booking_id")`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_bbd6ac6e3e6a8f8c6e0e8692d63" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_bbd6ac6e3e6a8f8c6e0e8692d63"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "UQ_bbd6ac6e3e6a8f8c6e0e8692d63"`);
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "booking_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "check_out_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "check_in_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "total_amount" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "check_out" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "check_in" TIMESTAMP WITH TIME ZONE`);
    }

}
