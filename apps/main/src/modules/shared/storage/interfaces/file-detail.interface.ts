// Act as an interface for uploading file, since dto doesn't support validation for file type in dto
export interface IReceivedFile {
  key: string;
  file: Buffer;
  mimeType: string;
  originalName: string;
  size?: number;
  bucket?: string | null;
}
