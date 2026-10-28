import { StorageClientProvider } from '@libs/common/enums';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { DeleteFileDto, FileDto, GetFileUrlDto } from '../../dto';
import { IReceivedFile } from '../../interfaces';
import { IStorageProvider } from '../../interfaces/storage.interface';

@Injectable()
export class MinIOStorageProvider implements IStorageProvider {
  private readonly logger = new Logger(MinIOStorageProvider.name);
  private bucketName: string;
  private publicBaseUrl: string;
  private publicUrlexpirySeconds: number;

  constructor(
    @Inject(StorageClientProvider.MINIO) private readonly minioClient: Client,
    private configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>(
      'storage.provider.minio.bucketName',
    );
    this.publicBaseUrl = this.configService.get<string>(
      'storage.provider.minio.publicBaseUrl',
    );
    this.publicUrlexpirySeconds;
  }

  /**
   * `getFileUrl` (used at upload time) bakes a plain, unsigned URL straight
   * into every villa/activity/etc record — there is no per-request signing,
   * so the bucket itself must allow anonymous GetObject or every photo 403s
   * for anyone who didn't upload it. This used to be a manual, undocumented
   * step (`mc anonymous set download`); a wiped or freshly-cloned MinIO data
   * dir silently broke every image with no error until someone thought to
   * check the bucket policy. Called from StorageFactory on every boot —
   * cheap, idempotent, and self-healing if the policy is ever reset by hand.
   * (Can't be a NestJS `OnModuleInit` hook: this class is constructed with a
   * plain `new`, not registered as its own provider, so Nest never sees it
   * to invoke lifecycle hooks on.)
   */
  async ensureBucketProvisioned(): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName);
        this.logger.log(`Created MinIO bucket "${this.bucketName}"`);
      }

      const publicReadPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };

      await this.minioClient.setBucketPolicy(
        this.bucketName,
        JSON.stringify(publicReadPolicy),
      );
    } catch (error) {
      this.logger.error(
        `Failed to provision MinIO bucket "${this.bucketName}" — uploaded files may 403 until this is fixed: ${error.message}`,
      );
    }
  }

  async uploadFile(payload: IReceivedFile): Promise<FileDto> {
    await this.minioClient.putObject(
      this.bucketName,
      payload.key,
      payload.file,
      payload.size,
      {
        'Content-Type': payload.mimeType,
      },
    );

    return this.getFileUrl({ key: payload.key });
  }

  getFileUrl(payload: GetFileUrlDto): FileDto {
    return {
      url: `${this.publicBaseUrl}/${this.bucketName}/${payload.key}`,
    };
  }

  async getFileUrlAsync(payload: GetFileUrlDto): Promise<FileDto> {
    const objectName = payload.key.split('/').slice(4).join('/');

    const publicUrl = await this.minioClient.presignedGetObject(
      this.bucketName,
      objectName,
    );

    return {
      url: publicUrl,
    };
  }

  async deleteFile(payload: DeleteFileDto): Promise<void> {
    const keyFromPayload = this._extractPath(payload.key);

    if (keyFromPayload) {
      await this.minioClient.removeObject(this.bucketName, keyFromPayload);
    }
  }

  _extractPath(url: string): string | null {
    const match = url.match(/\/([^/]+)\/(.+)$/);

    return match ? match[1] : null;
  }
}
