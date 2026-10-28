import { Readable } from 'stream';
import { DeleteFileDto, FileDto, GetFileUrlDto } from '../dto';
import { IReceivedFile } from './file-detail.interface';

export interface IObjectStream {
  stream: Readable;
  contentType?: string;
  contentLength?: number;
}

export interface IStorageProvider {
  uploadFile(payload: IReceivedFile): Promise<FileDto>;

  deleteFile(payload: DeleteFileDto): Promise<void>;

  getFileUrl(payload: GetFileUrlDto): FileDto;

  getFileUrlAsync(payload: GetFileUrlDto): Promise<FileDto>;

  // Only meaningful for providers with no public URL of their own (Garage in
  // "plain S3 API" mode — its public "website" access is subdomain-routed,
  // which a single flat Cloudflare quick-tunnel hostname can't address). Those
  // providers point getFileUrl at this app's own /storages/files/* route
  // instead, which calls this to pull the bytes and stream them straight
  // through — one fewer tunnel to keep alive, and it works the same way
  // regardless of which storage backend is actually behind it.
  getFileStream?(key: string): Promise<IObjectStream>;
}
