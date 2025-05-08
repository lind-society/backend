import { envValues } from '@apps/main/config';
import { Environment } from '@libs/common/enums';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_TYPE, DB_USER, NODE_ENV } =
  envValues;

export default new DataSource({
  type: DB_TYPE as PostgresConnectionOptions['type'],
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  logging: NODE_ENV === Environment.Development,
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  cache: false,
});
