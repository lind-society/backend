import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742656328874 implements MigrationInterface {
    name = 'Migration1742656328874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facilities" ADD CONSTRAINT "UQ_06bcfef94e04a223a5c46921932" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facilities" DROP CONSTRAINT "UQ_06bcfef94e04a223a5c46921932"`);
    }

}
