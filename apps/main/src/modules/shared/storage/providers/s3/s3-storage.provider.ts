import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { StorageClientProvider } from '@libs/common/enums';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { DeleteFileDto, FileDto, GetFileUrlDto } from '../../dto';
import { IReceivedFile } from '../../interfaces';
import {
  IObjectStream,
  IStorageProvider,
} from '../../interfaces/storage.interface';

// S3-compatible provider, used for Cloudflare R2. `publicBaseUrl` must point
// at a permanent public URL for the bucket — R2's own `<id>.r2.dev` subdomain
// or a custom domain attached to the bucket in the Cloudflare dashboard —
// enabled there under the bucket's Settings > Public Access. Unlike the MinIO
// provider, this class can't provision that itself: R2 has no bucket-policy
// API to flip it on programmatically.
@Injectable()
export class S3StorageProvider implements IStorageProvider {
  private readonly logger = new Logger(S3StorageProvider.name);
  private bucketName: string;
  private publicBaseUrl: string;

  constructor(
    @Inject(StorageClientProvider.S3) private readonly s3Client: S3Client,
    private configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>(
      'storage.provider.s3.bucketName',
    );
    this.publicBaseUrl = this.configService
      .get<string>('storage.provider.s3.publicBaseUrl')
      ?.replace(/\/+$/, '');
  }

  async uploadFile(payload: IReceivedFile): Promise<FileDto> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: payload.key,
        Body: payload.file,
        ContentType: payload.mimeType,
      }),
    );

    return this.getFileUrl({ key: payload.key });
  }

  getFileUrl(payload: GetFileUrlDto): FileDto {
    // R2's public URL (r2.dev subdomain or a custom domain attached to the
    // bucket) already identifies the bucket — unlike MinIO/GCS, the bucket
    // name is not part of the object path.
    return {
      url: `${this.publicBaseUrl}/${payload.key}`,
    };
  }

  async getFileUrlAsync(payload: GetFileUrlDto): Promise<FileDto> {
    return this.getFileUrl(payload);
  }

  async getFileStream(key: string): Promise<IObjectStream> {
    try {
      const result = await this.s3Client.send(
        new GetObjectCommand({ Bucket: this.bucketName, Key: key }),
      );

      return {
        stream: result.Body as Readable,
        contentType: result.ContentType,
        contentLength: result.ContentLength,
      };
    } catch (error) {
      if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
        throw new NotFoundException(`file "${key}" not found`);
      }

      throw error;
    }
  }

  async deleteFile(payload: DeleteFileDto): Promise<void> {
    const key = this._extractKey(payload.key);

    if (!key) {
      this.logger.warn(
        `Could not resolve an object key from "${payload.key}" — skipping delete`,
      );
      return;
    }

    await this.s3Client.send(
      new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }),
    );
  }

  // `payload.key` here is the full public URL (matching every other
  // provider's DeleteFileDto usage), so recover the object key by stripping
  // the known public-base-URL prefix rather than regexing path segments —
  // any bucket/domain name that itself contains a "/" would otherwise be
  // ambiguous.
  _extractKey(url: string): string | null {
    const prefix = `${this.publicBaseUrl}/`;
    return url.startsWith(prefix) ? url.slice(prefix.length) : null;
  }
}
