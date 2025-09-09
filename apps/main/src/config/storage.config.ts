import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const {
  GCP_BUCKET_NAME,
  GCP_KEY_FILE_PATH,
  GCP_PROJECT_ID,
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_USE_SSL,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET_NAME,
  MINIO_PUBLIC_BASE_URL,
  STORAGE_PROVIDER,
} = envValues;

export const storageConfig = registerAs('storage', () => ({
  currentProvider: STORAGE_PROVIDER,
  provider: {
    gcp: {
      bucketName: GCP_BUCKET_NAME,
      keyFilePath: GCP_KEY_FILE_PATH,
      projectId: GCP_PROJECT_ID,
    },
    minio: {
      endpoint: MINIO_ENDPOINT,
      port: MINIO_PORT,
      useSSL: MINIO_USE_SSL,
      accessKey: MINIO_ACCESS_KEY,
      secretKey: MINIO_SECRET_KEY,
      bucketName: MINIO_BUCKET_NAME,
      publicBaseUrl: MINIO_PUBLIC_BASE_URL,
    },
  },
}));
