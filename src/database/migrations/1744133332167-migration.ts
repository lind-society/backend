import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1744133332167 implements MigrationInterface {
    name = 'Migration1744133332167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "package_benefits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_0e3e2c54105fb87048728c747ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "package_benefit_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "package_id" uuid NOT NULL, "benefit_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_c1f03cc393c9b40e3ecd6ad6de5" UNIQUE ("package_id", "benefit_id"), CONSTRAINT "PK_5cc8f579518e0d7626932af4370" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "packages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_020801f620e21f943ead9311c98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "package_benefit_pivot" ADD CONSTRAINT "FK_391549139fe96c88cfd4c526851" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "package_benefit_pivot" ADD CONSTRAINT "FK_886c2389660ad4f0bcf24b7d858" FOREIGN KEY ("benefit_id") REFERENCES "package_benefits"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package_benefit_pivot" DROP CONSTRAINT "FK_886c2389660ad4f0bcf24b7d858"`);
        await queryRunner.query(`ALTER TABLE "package_benefit_pivot" DROP CONSTRAINT "FK_391549139fe96c88cfd4c526851"`);
        await queryRunner.query(`DROP TABLE "packages"`);
        await queryRunner.query(`DROP TABLE "package_benefit_pivot"`);
        await queryRunner.query(`DROP TABLE "package_benefits"`);
    }

}
