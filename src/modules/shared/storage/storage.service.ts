import { Inject, Injectable } from '@nestjs/common';
import { sanitizeString } from 'src/common/helpers/sanitize-string.helper';
import { DeleteFileDto } from './dto/delete-file.dto';
import { FileDto } from './dto/file.dto';
import { GetFileUrlDto } from './dto/get-file-url.dto';
import { IReceivedFile } from './interfaces/file-detail.interface';
import { IStorageProvider } from './interfaces/storage.interface';

@Injectable()
export class StorageService {
  constructor(
    @Inject('STORAGE_PROVIDER')
    private readonly storageProvider: IStorageProvider,
  ) {}

  async uploadFile(payload: IReceivedFile): Promise<FileDto> {
    const originalFileName = payload.originalName.split('.');
    const fileExtension = originalFileName.pop();
    const fileName = originalFileName.join('.');

    payload.key = `${payload.key}/${sanitizeString(fileName)}-${Date.now()}.${fileExtension}`;

    return this.storageProvider.uploadFile(payload);
  }

  getFileUrl(payload: GetFileUrlDto): FileDto {
    return this.storageProvider.getFileUrl(payload);
  }

  async deleteFile(payload: DeleteFileDto): Promise<void> {
    await this.storageProvider.deleteFile(payload);
  }
}
