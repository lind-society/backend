import { sanitizeString } from '@apps/main/common/helpers';
import { Inject, Injectable } from '@nestjs/common';
import {
  DeleteFileDto,
  FileDto,
  GetFileUrlDto,
  UploadFilesResponseDto,
} from './dto';
import { IReceivedFile, IStorageProvider } from './interfaces';

@Injectable()
export class StorageService {
  constructor(
    @Inject('STORAGE_PROVIDER')
    private readonly storageProvider: IStorageProvider,
  ) {}

  async uploadFiles(payload: IReceivedFile[]): Promise<UploadFilesResponseDto> {
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

  async getFileUrl(payload: GetFileUrlDto): Promise<FileDto> {
    return this.storageProvider.getFileUrlAsync(payload);
  }

  async deleteFile(payload: DeleteFileDto): Promise<void> {
    await this.storageProvider.deleteFile(payload);
  }

  mapFiles(files: Express.Multer.File[], key: string) {
    const receivedFiles: IReceivedFile[] = files.map((file) => ({
      key,
      size: file.size,
      file: file.buffer,
      mimeType: file.mimetype,
      originalName: file.originalname,
    }));

    return receivedFiles;
  }
}
