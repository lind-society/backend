import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745683881684 implements MigrationInterface {
    name = 'Migration1745683881684'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "place_nearby" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "videos" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "place_nearby" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "videos" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "place_nearby" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "videos" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "videos" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "place_nearby" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "videos" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "place_nearby" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "videos" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "place_nearby" SET NOT NULL`);
    }

}
