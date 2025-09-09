import { StorageClientProvider } from '@libs/common/enums';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { DeleteFileDto, FileDto, GetFileUrlDto } from '../../dto';
import { IReceivedFile } from '../../interfaces';
import { IStorageProvider } from '../../interfaces/storage.interface';

@Injectable()
export class MinIOStorageProvider implements IStorageProvider {
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
