import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745698254534 implements MigrationInterface {
    name = 'Migration1745698254534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_bbd6ac6e3e6a8f8c6e0e8692d63"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP CONSTRAINT "FK_afaa5733b05d8844072d5107eae"`);
        await queryRunner.query(`CREATE TYPE "public"."activity_bookings_status_enum" AS ENUM('Pending', 'Confirmed', 'Completed', 'Canceled')`);
        await queryRunner.query(`CREATE TABLE "activity_bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total_guest" integer NOT NULL, "total_amount" numeric(15,2) NOT NULL, "booking_date" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."activity_bookings_status_enum" NOT NULL, "currency_id" uuid NOT NULL, "customer_id" uuid NOT NULL, "activity_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_71e78e541cdf0126c985d4c101e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."villa_bookings_status_enum" AS ENUM('Requested', 'Negotiation', 'Waiting for Payment', 'Booked', 'Checked In', 'Done', 'Canceled')`);
        await queryRunner.query(`CREATE TABLE "villa_bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total_guest" integer NOT NULL, "total_amount" numeric(15,2) NOT NULL, "check_in_date" TIMESTAMP WITH TIME ZONE NOT NULL, "check_out_date" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."villa_bookings_status_enum" NOT NULL, "currency_id" uuid NOT NULL, "customer_id" uuid NOT NULL, "villa_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_caaa9e9b5be585c01ccbb6afa70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "UQ_bbd6ac6e3e6a8f8c6e0e8692d63"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_2b1e1cd13649e9315b28b7f2f0c"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "booking_id"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "property_id"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP COLUMN "booking_id"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "activity_booking_id" uuid`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "UQ_7ee309d160b63c855c9cab7d883" UNIQUE ("activity_booking_id")`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "villa_booking_id" uuid`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "UQ_ca4b9f0b13ad8dc66f07e9d8ce2" UNIQUE ("villa_booking_id")`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD "activity_booking_id" uuid`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD "villa_booking_id" uuid`);
        await queryRunner.query(`ALTER TABLE "owners" ALTER COLUMN "company_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ee309d160b63c855c9cab7d883" FOREIGN KEY ("activity_booking_id") REFERENCES "activity_bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_ca4b9f0b13ad8dc66f07e9d8ce2" FOREIGN KEY ("villa_booking_id") REFERENCES "villa_bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD CONSTRAINT "FK_3226d265af657df26bd0879f4de" FOREIGN KEY ("activity_booking_id") REFERENCES "activity_bookings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD CONSTRAINT "FK_5c3f9775b35237386636e6fa810" FOREIGN KEY ("villa_booking_id") REFERENCES "villa_bookings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_bookings" ADD CONSTRAINT "FK_4fbb07385f2ff513b30c6196435" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_bookings" ADD CONSTRAINT "FK_17dbb43ef57dd0005e1578663e5" FOREIGN KEY ("customer_id") REFERENCES "booking_customers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_bookings" ADD CONSTRAINT "FK_71207700b17caf30747cf9690d7" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_bookings" ADD CONSTRAINT "FK_2fb92e6e9004634edadb6872a0f" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_bookings" ADD CONSTRAINT "FK_8bf6b78eafbeaac90594465d70d" FOREIGN KEY ("customer_id") REFERENCES "booking_customers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "villa_bookings" ADD CONSTRAINT "FK_bf4a034e5d49c2f81180b7f7004" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villa_bookings" DROP CONSTRAINT "FK_bf4a034e5d49c2f81180b7f7004"`);
        await queryRunner.query(`ALTER TABLE "villa_bookings" DROP CONSTRAINT "FK_8bf6b78eafbeaac90594465d70d"`);
        await queryRunner.query(`ALTER TABLE "villa_bookings" DROP CONSTRAINT "FK_2fb92e6e9004634edadb6872a0f"`);
        await queryRunner.query(`ALTER TABLE "activity_bookings" DROP CONSTRAINT "FK_71207700b17caf30747cf9690d7"`);
        await queryRunner.query(`ALTER TABLE "activity_bookings" DROP CONSTRAINT "FK_17dbb43ef57dd0005e1578663e5"`);
        await queryRunner.query(`ALTER TABLE "activity_bookings" DROP CONSTRAINT "FK_4fbb07385f2ff513b30c6196435"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP CONSTRAINT "FK_5c3f9775b35237386636e6fa810"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP CONSTRAINT "FK_3226d265af657df26bd0879f4de"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_ca4b9f0b13ad8dc66f07e9d8ce2"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "property_id" uuid`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ee309d160b63c855c9cab7d883"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP COLUMN "villa_booking_id"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP COLUMN "activity_booking_id"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "UQ_ca4b9f0b13ad8dc66f07e9d8ce2"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "villa_booking_id"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "UQ_7ee309d160b63c855c9cab7d883"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "activity_booking_id"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD "booking_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "booking_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "UQ_bbd6ac6e3e6a8f8c6e0e8692d63" UNIQUE ("booking_id")`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_2b1e1cd13649e9315b28b7f2f0c" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "villa_bookings"`);
        await queryRunner.query(`DROP TYPE "public"."villa_bookings_status_enum"`);
        await queryRunner.query(`DROP TABLE "activity_bookings"`);
        await queryRunner.query(`DROP TYPE "public"."activity_bookings_status_enum"`);
        await queryRunner.query(`ALTER TABLE "owners" ALTER COLUMN "company_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD CONSTRAINT "FK_afaa5733b05d8844072d5107eae" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_bbd6ac6e3e6a8f8c6e0e8692d63" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
