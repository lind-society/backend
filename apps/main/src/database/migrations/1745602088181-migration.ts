import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1745602088181 implements MigrationInterface {
    name = 'Migration1745602088181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" RENAME COLUMN "floor_plan" TO "floor_plans"`);
        await queryRunner.query(`ALTER TABLE "activities" RENAME COLUMN "floor_plan" TO "floor_plans"`);
        await queryRunner.query(`ALTER TABLE "villas" RENAME COLUMN "floor_plan" TO "floor_plans"`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "place_nearby" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "videos" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "place_nearby" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "videos" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "place_nearby" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "videos" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_7598dc2fefd73433353e760ec68"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_9a8da83eb74b4ced2d34c562aa3"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_9a8da83eb74b4ced2d34c562aa3" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_7598dc2fefd73433353e760ec68" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villas" RENAME COLUMN "floor_plans" TO "floor_plan"`);
        await queryRunner.query(`ALTER TABLE "activities" RENAME COLUMN "floor_plans" TO "floor_plan"`);
        await queryRunner.query(`ALTER TABLE "properties" RENAME COLUMN "floor_plans" TO "floor_plan"`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "videos" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villas" ALTER COLUMN "place_nearby" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "videos" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ALTER COLUMN "place_nearby" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "videos" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "place_nearby" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_7598dc2fefd73433353e760ec68"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_9a8da83eb74b4ced2d34c562aa3"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_9a8da83eb74b4ced2d34c562aa3" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_7598dc2fefd73433353e760ec68" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
