import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740229803969 implements MigrationInterface {
    name = 'Migration1740229803969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "facility_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_7b4412a620405e150a5d748740f" UNIQUE ("name"), CONSTRAINT "PK_e82c02c1a7f5ab2ae4cacea12f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "facility_category_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "facility_id" uuid NOT NULL, "facility_category_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_161aabf41c5f2f0fd24898577da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "facility" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "icon" character varying, "additional_price" numeric, "description" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_07c6c82781d105a680b5c265be6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "facility_category_pivot" ADD CONSTRAINT "FK_cc1bb3aff6bd354a07ba6c633a4" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "facility_category_pivot" ADD CONSTRAINT "FK_53b42daec4cde94a3dfcb75ebe7" FOREIGN KEY ("facility_category_id") REFERENCES "facility_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facility_category_pivot" DROP CONSTRAINT "FK_53b42daec4cde94a3dfcb75ebe7"`);
        await queryRunner.query(`ALTER TABLE "facility_category_pivot" DROP CONSTRAINT "FK_cc1bb3aff6bd354a07ba6c633a4"`);
        await queryRunner.query(`DROP TABLE "facility"`);
        await queryRunner.query(`DROP TABLE "facility_category_pivot"`);
        await queryRunner.query(`DROP TABLE "facility_category"`);
    }

}
