import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1743405709586 implements MigrationInterface {
    name = 'Migration1743405709586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_7598dc2fefd73433353e760ec68"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_9a8da83eb74b4ced2d34c562aa3"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "activity_id"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "villa_id"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "average_rating" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "average_rating" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "average_rating" numeric(5,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "average_rating"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "average_rating"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "average_rating"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "villa_id" uuid`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "activity_id" uuid`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_9a8da83eb74b4ced2d34c562aa3" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_7598dc2fefd73433353e760ec68" FOREIGN KEY ("villa_id") REFERENCES "villas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
