import { Storage } from '@google-cloud/storage';
import { StorageClientProvider } from '@libs/common/enums';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeleteFileDto, FileDto, GetFileUrlDto } from '../../dto';
import { IReceivedFile } from '../../interfaces';
import { IStorageProvider } from '../../interfaces/storage.interface';
@Injectable()
export class GCPStorageProvider implements IStorageProvider {
  private bucketName: string;

  constructor(
    @Inject(StorageClientProvider.GCP) private readonly storage: Storage,
    private configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>(
      'storage.provider.gcp.bucketName',
    );
  }

  async uploadFile(payload: IReceivedFile): Promise<FileDto> {
    const bucketRef = this.storage.bucket(this.bucketName);
    const fileRef = bucketRef.file(payload.key);

    await fileRef.save(payload.file, { contentType: payload.mimeType });

    return this.getFileUrl({ ...payload });
  }

  getFileUrl(payload: GetFileUrlDto): FileDto {
    return {
      url: `https://storage.googleapis.com/${this.bucketName}/${payload.key}`,
    };
  }

  async getFileUrlAsync(payload: GetFileUrlDto): Promise<FileDto> {
    return {
      url: `https://storage.googleapis.com/${this.bucketName}/${payload.key}`,
    };
  }

  async deleteFile(payload: DeleteFileDto): Promise<void> {
    const bucketRef = this.storage.bucket(this.bucketName);

    const keyFromPayload = this._extractPath(payload.key);

    if (keyFromPayload) {
      await bucketRef.file(keyFromPayload).delete();
    }
  }

  _extractPath(url: string): string | null {
    const match = url.match(/storage\.googleapis\.com\/.*?\/(villa\/.*)/);

    return match ? match[1] : null;
  }
}
