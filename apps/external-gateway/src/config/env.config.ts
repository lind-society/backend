import { envPaths } from '@libs/common/constants/env-path.constant';
import { Environment } from '@libs/common/enums/environment.enum';
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { config, DotenvConfigOptions } from 'dotenv';

export class EnvironmentVariables {
  @IsEnum(Environment, {
    message: `NODE_ENV environment variable must be one of: ${Object.values(Environment).join(', ')}`,
  })
  @IsOptional()
  NODE_ENV?: Environment | null;

  @IsString()
  @IsOptional()
  API_VERSION?: string | null;

  @IsString()
  @IsOptional()
  HOST?: string | null;

  @IsString()
  @IsNotEmpty()
  EXTERNAL_GATEWAY_PORT!: string;

  @IsString()
  @IsNotEmpty()
  LINDWAY_CLIENT!: string;

  @IsString()
  @IsNotEmpty()
  LIND_SOCIETY_CLIENT!: string;
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
