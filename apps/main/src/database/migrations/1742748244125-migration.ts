import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742748244125 implements MigrationInterface {
    name = 'Migration1742748244125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "booking_payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paymentMethod" character varying NOT NULL, "amount" numeric(15,2), "status" character varying NOT NULL, "currency_id" uuid NOT NULL, "booking_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "bookingId" uuid, CONSTRAINT "PK_4f54ffc7dfddb70234fb53a97a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total_guest" integer NOT NULL, "total_amount" numeric(15,2), "check_in_date" TIMESTAMP WITH TIME ZONE, "check_out_date" TIMESTAMP WITH TIME ZONE, "currency_id" uuid NOT NULL, "customer_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "booking_customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_8636c5570eab54dd71e73d4edd9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD CONSTRAINT "FK_fdf05d91b1e998a6b8179f11434" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_payments" ADD CONSTRAINT "FK_ed7bac501329c7f3c00722c988b" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_f960015e875a65b06cd17d6f791" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_8e21b7ae33e7b0673270de4146f" FOREIGN KEY ("customer_id") REFERENCES "booking_customers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_8e21b7ae33e7b0673270de4146f"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_f960015e875a65b06cd17d6f791"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP CONSTRAINT "FK_ed7bac501329c7f3c00722c988b"`);
        await queryRunner.query(`ALTER TABLE "booking_payments" DROP CONSTRAINT "FK_fdf05d91b1e998a6b8179f11434"`);
        await queryRunner.query(`DROP TABLE "booking_customers"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TABLE "booking_payments"`);
    }

}
