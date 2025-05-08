import { Environment } from '@libs/common/enums';
import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { envValues } from './env-values.config';

const { DB_TYPE, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, NODE_ENV } =
  envValues;

export const databaseConfig = registerAs('database', () => ({
  type: DB_TYPE as PostgresConnectionOptions['type'],
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [
    join(__dirname, '../../../../apps/main/src/database/entities/*.entity.js'),
    join(__dirname, '../../../../libs/common/entities/*.entity.js'),
  ],
  synchronize: false,
  logging: NODE_ENV === Environment.Development,
  migrations: [__dirname + '/migrations/*-migration.js'],
  migrationsTableName: 'migrations',
  cache: false,
}));
