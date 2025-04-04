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
import { envPaths } from 'src/common/constants';
import { Environment } from 'src/common/enums';
import { megabyteToByte } from 'src/common/helpers';

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

  @IsNumber()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT?: number | null;

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

  @IsString()
  @IsNotEmpty()
  STORAGE_PROVIDER!: string;

  @IsString()
  @IsNotEmpty()
  GCP_BUCKET_NAME!: string;

  @IsString()
  @IsNotEmpty()
  GCP_KEY_FILE_PATH!: string;

  @IsString()
  @IsNotEmpty()
  GCP_PROJECT_ID!: string;

  @IsString()
  @IsNotEmpty()
  JWT_AT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_RT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_AT_EXPIRE!: string;

  @IsString()
  @IsNotEmpty()
  JWT_RT_EXPIRE!: string;

  @IsNumber()
  @Min(0)
  @Max(20)
  @IsNotEmpty()
  PHOTOS_LIMIT_QUANTITY!: number;

  @IsNumber()
  @Min(0)
  @Max(megabyteToByte(100))
  @IsNotEmpty()
  PHOTOS_LIMIT_SIZE!: number;

  @IsNumber()
  @Min(0)
  @Max(20)
  @IsNotEmpty()
  VIDEOS_LIMIT_QUANTITY!: number;

  @IsNumber()
  @Min(0)
  @Max(megabyteToByte(100))
  @IsNotEmpty()
  VIDEOS_LIMIT_SIZE!: number;

  @IsNumber()
  @Min(0)
  @Max(20)
  @IsNotEmpty()
  VIDEO360S_LIMIT_QUANTITY!: number;

  @IsNumber()
  @Min(0)
  @Max(megabyteToByte(100))
  @IsNotEmpty()
  VIDEO360S_LIMIT_SIZE!: number;

  @IsString()
  @IsNotEmpty()
  INDONESIA_REGION_FETCH!: string;

  @IsString()
  @IsNotEmpty()
  INDONESIA_POSTAL_CODE_FETCH!: string;

  @IsString()
  @IsNotEmpty()
  GLOBAL_REGION_FETCH!: string;

  @IsString()
  @IsNotEmpty()
  GLOBAL_POSTAL_CODE_FETCH!: string;

  @IsString()
  @IsNotEmpty()
  GEONAMES_API_USERNAME!: string;

  @IsString()
  @IsNotEmpty()
  WHATSAPP_MAIN_CLIENT_ID!: string;

  @IsString()
  @IsNotEmpty()
  WHATSAPP_AUTH_STRATEGY!: string;

  @IsString()
  @IsNotEmpty()
  COUNTRY_PHONE_CODE_JSON_PATH!: string;
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
