import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Inbox for messages left on the public site: contact form, villa/property
 * inquiries, early-bird and property-management requests.
 */
export class Migration1789000000000 implements MigrationInterface {
  name = 'Migration1789000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "inquiries_type_enum" AS ENUM
        ('contact', 'villa', 'property', 'activity', 'early_bird', 'manage_property')
    `);
    await queryRunner.query(`
      CREATE TYPE "inquiries_status_enum" AS ENUM ('new', 'read', 'archived')
    `);
    await queryRunner.query(`
      CREATE TABLE "inquiries" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "type" "inquiries_type_enum" NOT NULL,
        "status" "inquiries_status_enum" NOT NULL DEFAULT 'new',
        "name" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "phone" character varying(50),
        "message" text,
        "reference_id" uuid,
        "reference_name" character varying(255),
        "metadata" jsonb,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_inquiries_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_inquiries_type" ON "inquiries" ("type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_inquiries_status" ON "inquiries" ("status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inquiries_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inquiries_type"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inquiries"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "inquiries_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "inquiries_type_enum"`);
  }
}
