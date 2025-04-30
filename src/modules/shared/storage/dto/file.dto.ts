export interface IFileDto {
  url: string;
}

export interface IFailedUploadFileDto {
  file: string;
  error: string;
}

export class FileDto implements IFileDto {
  readonly url!: string;
}

export class FailedUploadFileDto implements IFailedUploadFileDto {
  readonly file!: string;
  readonly error!: string;
}
