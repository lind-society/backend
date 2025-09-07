import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1755701799006 implements MigrationInterface {
  name = 'Migration1755701799006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_activity_average_rating()
            RETURNS TRIGGER AS $$
            BEGIN
                IF NEW.activity_id IS NOT NULL THEN
                    UPDATE activities
                    SET average_rating = (
                            SELECT COALESCE(AVG(rating),0) 
                            FROM reviews 
                            WHERE activity_id = NEW.activity_id
                        ),
                        total_review = (
                            SELECT COUNT(*) 
                            FROM reviews 
                            WHERE activity_id = NEW.activity_id
                        )
                    WHERE id = NEW.activity_id;
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_villa_average_rating()
            RETURNS TRIGGER AS $$
            BEGIN
                IF NEW.villa_id IS NOT NULL THEN
                    UPDATE villas
                    SET average_rating = (
                            SELECT COALESCE(AVG(rating),0) 
                            FROM reviews 
                            WHERE villa_id = NEW.villa_id
                        ),
                        total_review = (
                            SELECT COUNT(*) 
                            FROM reviews 
                            WHERE villa_id = NEW.villa_id
                        )
                    WHERE id = NEW.villa_id;
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
    await queryRunner.query(`
            CREATE TRIGGER trigger_update_activity_average_rating
            AFTER INSERT OR UPDATE OR DELETE ON reviews
            FOR EACH ROW
            EXECUTE FUNCTION update_activity_average_rating();
        `);
    await queryRunner.query(`
            CREATE TRIGGER trigger_update_villa_average_rating
            AFTER INSERT OR UPDATE OR DELETE ON reviews
            FOR EACH ROW
            EXECUTE FUNCTION update_villa_average_rating();
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trigger_update_activity_average_rating ON reviews;`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trigger_update_villa_average_rating ON reviews;`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS update_activity_average_rating();`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS update_villa_average_rating();`,
    );
  }
}
