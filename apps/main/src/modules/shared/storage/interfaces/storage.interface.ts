import { DeleteFileDto, FileDto, GetFileUrlDto } from '../dto';
import { IReceivedFile } from './file-detail.interface';

export interface IStorageProvider {
  uploadFile(payload: IReceivedFile): Promise<FileDto>;

  deleteFile(payload: DeleteFileDto): Promise<void>;

  getFileUrl(payload: GetFileUrlDto): FileDto;

  getFileUrlAsync(payload: GetFileUrlDto): Promise<FileDto>;
}
