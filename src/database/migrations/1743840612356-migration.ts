import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1743840612356 implements MigrationInterface {
    name = 'Migration1743840612356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_customers" ADD "phone_country_code" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_customers" DROP COLUMN "phone_country_code"`);
    }

}
