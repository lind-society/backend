import { envPaths } from '@libs/common/constants';
import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';
import { config, DotenvConfigOptions } from 'dotenv';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  MAIL_HOST!: string;

  @IsString()
  @IsNotEmpty()
  MAIL_PORT!: string;

  @IsString()
  @IsNotEmpty()
  MAIL_SECURE!: string;

  @IsString()
  @IsNotEmpty()
  MAIL_USER!: string;

  @IsString()
  @IsNotEmpty()
  MAIL_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  MAIL_SENDER_EMAIL!: string;
  
  @IsString()
  @IsNotEmpty()
  MAIL_SENDER_NAME!: string;
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
