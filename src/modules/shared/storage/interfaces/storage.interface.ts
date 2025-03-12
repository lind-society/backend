import {
  DeleteFileDto,
  FileDto,
  GetFileUrlDto,
  UploadFileRequestDto,
} from '../dto';

export interface IStorageProvider {
  uploadFile(payload: UploadFileRequestDto): Promise<FileDto>;

  deleteFile(payload: DeleteFileDto): Promise<void>;

  getFileUrl(payload: GetFileUrlDto): FileDto;
}
