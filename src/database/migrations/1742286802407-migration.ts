import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742286802407 implements MigrationInterface {
    name = 'Migration1742286802407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "sold_status"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "check_in_hour" TIME(0) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "check_out_hour" TIME(0) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "check_out_hour"`);
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "check_in_hour"`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "sold_status" boolean NOT NULL DEFAULT false`);
    }

}
