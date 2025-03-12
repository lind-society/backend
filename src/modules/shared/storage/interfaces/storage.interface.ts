import { DeleteFileDto } from '../dto/delete-file.dto';
import { FileDto } from '../dto/file.dto';
import { GetFileUrlDto } from '../dto/get-file-url.dto';
import { UploadFileDto } from '../dto/upload-file.dto';

export interface IStorageProvider {
  uploadFile(payload: UploadFileDto): Promise<FileDto>;

  deleteFile(payload: DeleteFileDto): Promise<void>;

  getFileUrl(payload: GetFileUrlDto): FileDto;
}
