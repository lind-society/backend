export interface IFileDto {
  url: string;
}

export class FileDto implements IFileDto {
  readonly url!: string;
}
