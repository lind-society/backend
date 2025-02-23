import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740320351816 implements MigrationInterface {
    name = 'Migration1740320351816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "facility_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_728706e7a41672c7e026006af01" UNIQUE ("name"), CONSTRAINT "PK_cc3809a7e70470a644c7eead7be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "facilities_facility_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "facility_id" uuid NOT NULL, "facility_category_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_4ab72de19672ccb0067f5b6ae9c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "facilities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "icon" character varying, "additional_price" numeric, "description" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2e6c685b2e1195e6d6394a22bc7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_adc3bc773ccf2fb6f073193fcf6" UNIQUE ("name"), CONSTRAINT "PK_1056d6faca26b9957f5d26e6572" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blogs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" text NOT NULL, "author_id" uuid, "category_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "facilities_facility_categories" ADD CONSTRAINT "FK_f5a0e97b1f5dd08f620e372fe96" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "facilities_facility_categories" ADD CONSTRAINT "FK_5997467056daf2c01942a08f60d" FOREIGN KEY ("facility_category_id") REFERENCES "facility_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "FK_1f073a9f9720fe731423f1064cc" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_1f073a9f9720fe731423f1064cc"`);
        await queryRunner.query(`ALTER TABLE "facilities_facility_categories" DROP CONSTRAINT "FK_5997467056daf2c01942a08f60d"`);
        await queryRunner.query(`ALTER TABLE "facilities_facility_categories" DROP CONSTRAINT "FK_f5a0e97b1f5dd08f620e372fe96"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
        await queryRunner.query(`DROP TABLE "blog_categories"`);
        await queryRunner.query(`DROP TABLE "facilities"`);
        await queryRunner.query(`DROP TABLE "facilities_facility_categories"`);
        await queryRunner.query(`DROP TABLE "facility_categories"`);
    }

}
