import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740903554619 implements MigrationInterface {
    name = 'Migration1740903554619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "medias" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "photo" character varying, "video" character varying, "video_360" character varying, "additional_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_f27321557a66cd4fae9bc1ed6e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."additionals_type_enum" AS ENUM('bedrooms', 'indoor area', 'outdoor area', 'more pictures')`);
        await queryRunner.query(`CREATE TABLE "additionals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."additionals_type_enum" NOT NULL, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_96a84f18fd542f166df3940c69e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property_additional_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "additional_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b5b8ff1d8059f492037b5622532" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "facilities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "icon" character varying, "description" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2e6c685b2e1195e6d6394a22bc7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property_facility_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "facility_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_4929b2caea3ee2d2746638c7865" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "icon" character varying, "list" character varying array, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5c1e336df2f4a7051e5bf08a941" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property_feature_pivot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "feature_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9a2afffcd1b0fcdf94e51dcd743" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."properties_ownership_type_enum" AS ENUM('leasehold', 'freehold')`);
        await queryRunner.query(`CREATE TABLE "properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "location" character varying, "area_size" numeric(10,2), "ownership_type" "public"."properties_ownership_type_enum" NOT NULL, "price" numeric(10,2), "address" character varying, "country" character varying, "state" character varying, "city" character varying, "place_nearby" character varying array, "postal_code" character varying, "map_link" character varying, "sold_status" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "medias" ADD CONSTRAINT "FK_cbddf7297fc763458102c47d295" FOREIGN KEY ("additional_id") REFERENCES "additionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" ADD CONSTRAINT "FK_c0697048e5bee34e6c08cab0110" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" ADD CONSTRAINT "FK_90ba101c688b74ee2f4665b5845" FOREIGN KEY ("additional_id") REFERENCES "additionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_facility_pivot" ADD CONSTRAINT "FK_04a2b295fbc98ec49cae90f5841" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_facility_pivot" ADD CONSTRAINT "FK_1e04be5ffec1f31c2b16a3b31c2" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_feature_pivot" ADD CONSTRAINT "FK_4bcfba3b42a739c3b738fc93904" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_feature_pivot" ADD CONSTRAINT "FK_7de18df96af6bdd94b612d4c945" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_feature_pivot" DROP CONSTRAINT "FK_7de18df96af6bdd94b612d4c945"`);
        await queryRunner.query(`ALTER TABLE "property_feature_pivot" DROP CONSTRAINT "FK_4bcfba3b42a739c3b738fc93904"`);
        await queryRunner.query(`ALTER TABLE "property_facility_pivot" DROP CONSTRAINT "FK_1e04be5ffec1f31c2b16a3b31c2"`);
        await queryRunner.query(`ALTER TABLE "property_facility_pivot" DROP CONSTRAINT "FK_04a2b295fbc98ec49cae90f5841"`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" DROP CONSTRAINT "FK_90ba101c688b74ee2f4665b5845"`);
        await queryRunner.query(`ALTER TABLE "property_additional_pivot" DROP CONSTRAINT "FK_c0697048e5bee34e6c08cab0110"`);
        await queryRunner.query(`ALTER TABLE "medias" DROP CONSTRAINT "FK_cbddf7297fc763458102c47d295"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DROP TYPE "public"."properties_ownership_type_enum"`);
        await queryRunner.query(`DROP TABLE "property_feature_pivot"`);
        await queryRunner.query(`DROP TABLE "features"`);
        await queryRunner.query(`DROP TABLE "property_facility_pivot"`);
        await queryRunner.query(`DROP TABLE "facilities"`);
        await queryRunner.query(`DROP TABLE "property_additional_pivot"`);
        await queryRunner.query(`DROP TABLE "additionals"`);
        await queryRunner.query(`DROP TYPE "public"."additionals_type_enum"`);
        await queryRunner.query(`DROP TABLE "medias"`);
    }

}
