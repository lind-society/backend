import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { GCP_BUCKET_NAME, GCP_KEY_FILE_PATH, GCP_PROJECT_ID } = envValues;

export const gcpConfig = registerAs('gcp', () => ({
  bucketName: GCP_BUCKET_NAME,
  keyFilePath: GCP_KEY_FILE_PATH,
  projectId: GCP_PROJECT_ID,
}));
