import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { config, DotenvConfigOptions } from 'dotenv';
import { envPaths } from 'src/common/constants/env-path.constant';
import { Environment } from 'src/common/enums/environment.enum';

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV!: Environment;

  @IsString()
  @IsOptional()
  API_VERSION!: string;

  @IsString()
  @IsNotEmpty()
  HOST!: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  XENDIT_SECRET_KEY!: string;

  @IsString()
  @IsNotEmpty()
  DB_TYPE!: string;

  @IsString()
  @IsNotEmpty()
  DB_HOST!: string;

  @IsString()
  @IsNotEmpty()
  DB_PORT!: string;

  @IsString()
  @IsNotEmpty()
  DB_USER!: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME!: string;
}

export function envConfig(options?: DotenvConfigOptions) {
  return config({
    path: envPaths[process.env.NODE_ENV || 'development'],
    ...options,
  });
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
