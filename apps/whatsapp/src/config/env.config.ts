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
  @IsOptional()
  CHROME_WS_ENDPOINT!: string;

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
  WHATSAPP_BROWSER_EXECUTABLE_PATH_UBUNTU!: string;

  @IsString()
  @IsNotEmpty()
  WHATSAPP_BROWSER_EXECUTABLE_PATH_WINDOWS!: string;

  /**
   * WhatsApp Web build to pin to, e.g. `2.3000.1044534801-alpha`. Optional:
   * leave it blank to track whatever WhatsApp serves, at the cost of the client
   * silently hanging whenever Meta changes the page out from under the library.
   */
  @IsString()
  @IsOptional()
  WHATSAPP_WEB_VERSION?: string;
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
