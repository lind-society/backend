import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742138258305 implements MigrationInterface {
    name = 'Migration1742138258305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villas" DROP COLUMN "ownership_type"`);
        await queryRunner.query(`DROP TYPE "public"."villas_ownership_type_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."villas_ownership_type_enum" AS ENUM('leasehold', 'freehold')`);
        await queryRunner.query(`ALTER TABLE "villas" ADD "ownership_type" "public"."villas_ownership_type_enum" NOT NULL`);
    }

}
