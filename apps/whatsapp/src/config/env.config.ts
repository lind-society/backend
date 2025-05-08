import { envPaths } from '@libs/common/constants';
import { Environment } from '@libs/common/enums';
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
  @IsNotEmpty()
  WHATSAPP_MAIN_CLIENT_ID!: string;

  @IsString()
  @IsNotEmpty()
  WHATSAPP_AUTH_STRATEGY!: string;

  @IsString()
  @IsNotEmpty()
  WHATSAPP_SESSION_PATH!: string;

  @IsString()
  @IsNotEmpty()
  WHATSAPP_BROWSER_EXECUTABLE_PATH!: string;
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
