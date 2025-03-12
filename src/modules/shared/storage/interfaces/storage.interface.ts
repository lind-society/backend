import { DeleteFileDto } from '../dto/delete-file.dto';
import { FileDto } from '../dto/file.dto';
import { GetFileUrlDto } from '../dto/get-file-url.dto';
import { UploadFileRequestDto } from '../dto/upload-file.dto';

export interface IStorageProvider {
  uploadFile(payload: UploadFileRequestDto): Promise<FileDto>;

  deleteFile(payload: DeleteFileDto): Promise<void>;

  getFileUrl(payload: GetFileUrlDto): FileDto;
}
