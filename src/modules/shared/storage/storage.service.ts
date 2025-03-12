import { Inject, Injectable } from '@nestjs/common';
import { sanitizeString } from 'src/common/helpers/sanitize-string.helper';
import { DeleteFileDto } from './dto/delete-file.dto';
import { FileDto } from './dto/file.dto';
import { GetFileUrlDto } from './dto/get-file-url.dto';
import { UploadFilesResponseDto } from './dto/upload-file.dto';
import { IReceivedFile } from './interfaces/file-detail.interface';
import { IStorageProvider } from './interfaces/storage.interface';

@Injectable()
export class StorageService {
  constructor(
    @Inject('STORAGE_PROVIDER')
    private readonly storageProvider: IStorageProvider,
  ) {}

  async uploadFile(payload: IReceivedFile[]): Promise<UploadFilesResponseDto> {
    const uploadResults = await Promise.all(
      payload.map(async (file: IReceivedFile) => {
        try {
          const originalFileName = file.originalName.split('.');
          const fileExtension = originalFileName.pop();
          const fileName = originalFileName.join('.');

          file.key = `${file.key}/${sanitizeString(fileName)}-${Date.now()}.${fileExtension}`;

          const uploadedFile = await this.storageProvider.uploadFile(file);

          return { success: true, data: uploadedFile };
        } catch (error) {
          return {
            success: false,
            error: error.message,
            file: file.originalName,
          };
        }
      }),
    );

    return {
      successFiles: uploadResults
        .filter((res) => res.success)
        .map((res) => res.data),
      failedFiles: uploadResults
        .filter((res) => !res.success)
        .map((res) => ({ file: res.file, error: res.error })),
    };
  }

  getFileUrl(payload: GetFileUrlDto): FileDto {
    return this.storageProvider.getFileUrl(payload);
  }

  async deleteFile(payload: DeleteFileDto): Promise<void> {
    await this.storageProvider.deleteFile(payload);
  }
}
