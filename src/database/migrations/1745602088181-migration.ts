import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745602088181 implements MigrationInterface {
    name = 'Migration1745602088181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" RENAME COLUMN "floor_plan" TO "floor_plans"`);
        await queryRunner.query(`ALTER TABLE "activities" RENAME COLUMN "floor_plan" TO "floor_plans"`);
        await queryRunner.query(`ALTER TABLE "villas" RENAME COLUMN "floor_plan" TO "floor_plans"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villas" RENAME COLUMN "floor_plans" TO "floor_plan"`);
        await queryRunner.query(`ALTER TABLE "activities" RENAME COLUMN "floor_plans" TO "floor_plan"`);
        await queryRunner.query(`ALTER TABLE "properties" RENAME COLUMN "floor_plans" TO "floor_plan"`);
    }

}
