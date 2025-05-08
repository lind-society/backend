import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1746737552614 implements MigrationInterface {
    name = 'Migration1746737552614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "queue"."message_queue_type_enum" AS ENUM('mail', 'payment', 'whatsapp')`);
        await queryRunner.query(`CREATE TYPE "queue"."message_queue_status_enum" AS ENUM('failed', 'pending', 'processing', 'sent')`);
        await queryRunner.query(`CREATE TABLE "queue"."message_queues" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message_queue_type" "queue"."message_queue_type_enum" NOT NULL, "recipient" character varying NOT NULL, "content" text NOT NULL, "message_queue_status" "queue"."message_queue_status_enum" NOT NULL DEFAULT 'pending', "retryCount" integer NOT NULL DEFAULT '0', "scheduled_at" TIMESTAMP WITH TIME ZONE, "sent_at" TIMESTAMP WITH TIME ZONE, "errorMessage" text, "metadata" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2cb1096abc3b5ff4e4d8165f0fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8d4b20a65aa5bbe929fe8691e2" ON "queue"."message_queues" ("message_queue_type") `);
        await queryRunner.query(`CREATE INDEX "IDX_1f32021148d7435fc52887bfd0" ON "queue"."message_queues" ("message_queue_status") `);
        await queryRunner.query(`CREATE INDEX "IDX_2c5bbb14923365babcc26a438b" ON "queue"."message_queues" ("scheduled_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "queue"."IDX_2c5bbb14923365babcc26a438b"`);
        await queryRunner.query(`DROP INDEX "queue"."IDX_1f32021148d7435fc52887bfd0"`);
        await queryRunner.query(`DROP INDEX "queue"."IDX_8d4b20a65aa5bbe929fe8691e2"`);
        await queryRunner.query(`DROP TABLE "queue"."message_queues"`);
        await queryRunner.query(`DROP TYPE "queue"."message_queue_status_enum"`);
        await queryRunner.query(`DROP TYPE "queue"."message_queue_type_enum"`);
    }

}
