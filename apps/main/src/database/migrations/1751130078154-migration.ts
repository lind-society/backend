import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751130078154 implements MigrationInterface {
    name = 'Migration1751130078154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" ADD "is_favorite" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "is_favorite" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "is_favorite" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "is_favorite"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "is_favorite"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "is_favorite"`);
    }

}
