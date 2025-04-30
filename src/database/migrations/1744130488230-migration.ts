import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1744130488230 implements MigrationInterface {
    name = 'Migration1744130488230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villa_policies" RENAME COLUMN "type" TO "type_id"`);
        await queryRunner.query(`ALTER TYPE "public"."villa_policies_type_enum" RENAME TO "villa_policies_type_id_enum"`);
        await queryRunner.query(`CREATE TABLE "villa_policy_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_6798e92bdebd3dea0764a57a65b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "villa_policies" DROP COLUMN "type_id"`);
        await queryRunner.query(`ALTER TABLE "villa_policies" ADD "type_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "villa_policies" ADD CONSTRAINT "FK_f979c1e1093fab5b7f09b20ea30" FOREIGN KEY ("type_id") REFERENCES "villa_policy_type"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_villa_policy_type_name_lowercase" ON "villa_policy_type" (LOWER(name))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "villa_policies" DROP CONSTRAINT "FK_f979c1e1093fab5b7f09b20ea30"`);
        await queryRunner.query(`ALTER TABLE "villa_policies" DROP COLUMN "type_id"`);
        await queryRunner.query(`ALTER TABLE "villa_policies" ADD "type_id" "public"."villa_policies_type_id_enum" NOT NULL`);
        await queryRunner.query(`DROP TABLE "villa_policy_type"`);
        await queryRunner.query(`ALTER TYPE "public"."villa_policies_type_id_enum" RENAME TO "villa_policies_type_enum"`);
        await queryRunner.query(`ALTER TABLE "villa_policies" RENAME COLUMN "type_id" TO "type"`);
        await queryRunner.query(`
          DROP INDEX "IDX_villa_policy_type_name_lowercase"
        `);
    }

}
