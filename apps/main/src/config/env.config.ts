import { megabyteToByte } from '@apps/main/common/helpers';
import { Environment } from '@libs/common/enums';
import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
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
import { envPaths } from '../common/constants/env-path.constant';

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
  MAIN_PORT?: number | null;

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
  FE_DEVELOPMENT!: string;

  @IsString()
  @IsNotEmpty()
  FE_STAGING!: string;

  @IsString()
  @IsNotEmpty()
  FE_PRODUCTION!: string;

  /**
   * The admin dashboard's origin. It only ever needs to be allowed through
   * CORS — guest-facing links are built from the FE_* URLs above, and must
   * never point at the dashboard. Optional so existing deployments keep
   * booting; when unset the dashboard simply is not whitelisted.
   */
  @IsString()
  @IsOptional()
  FE_ADMIN?: string;

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
  MINIO_ENDPOINT!: string;

  @IsString()
  @IsNotEmpty()
  MINIO_PORT!: string;

  @IsBoolean()
  @IsNotEmpty()
  MINIO_USE_SSL!: boolean;

  @IsString()
  @IsNotEmpty()
  MINIO_ACCESS_KEY!: string;

  @IsString()
  @IsNotEmpty()
  MINIO_SECRET_KEY!: string;

  @IsString()
  @IsNotEmpty()
  MINIO_BUCKET_NAME!: string;

  @IsString()
  @IsNotEmpty()
  MINIO_PUBLIC_BASE_URL!: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  MINIO_PUBLIC_URL_EXPIRY_SECONDS!: number;

  // S3-compatible provider (used for Cloudflare R2 — R2 speaks the S3 API).
  // Unlike MinIO through a Cloudflare quick tunnel, R2's public URL (a custom
  // domain or the account's r2.dev subdomain) doesn't change on every
  // restart, so URLs baked in at upload time stay valid.
  @IsString()
  @IsNotEmpty()
  S3_ENDPOINT!: string;

  @IsString()
  @IsNotEmpty()
  S3_REGION!: string;

  @IsString()
  @IsNotEmpty()
  S3_ACCESS_KEY_ID!: string;

  @IsString()
  @IsNotEmpty()
  S3_SECRET_ACCESS_KEY!: string;

  @IsString()
  @IsNotEmpty()
  S3_BUCKET_NAME!: string;

  @IsString()
  @IsNotEmpty()
  S3_PUBLIC_BASE_URL!: string;

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
  VIDEO_360S_LIMIT_QUANTITY!: number;

  @IsNumber()
  @Min(0)
  @Max(megabyteToByte(100))
  @IsNotEmpty()
  VIDEO_360S_LIMIT_SIZE!: number;

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
  COUNTRY_PHONE_CODE_JSON_PATH!: string;

  @IsString()
  @IsNotEmpty()
  BASE_CURRENCY_CODE!: string;

  @IsString()
  @IsNotEmpty()
  PAYMENT_GATEWAY_PROVIDER_NAME!: string;

  @IsString()
  @IsNotEmpty()
  PAYMENT_GATEWAY_PROVIDER_URL!: string;

  @IsString()
  @IsNotEmpty()
  XENDIT_USERNAME!: string;

  @IsString()
  @IsNotEmpty()
  XENDIT_API_VERSION!: string;

  @IsString()
  @IsNotEmpty()
  XENDIT_WEBHOOK_VERIFICATION_TOKEN!: string;
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
