import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeleteFileDto {
  @IsString()
  @IsNotEmpty()
  readonly key!: string;

  @IsString()
  @IsOptional()
  readonly bukcet?: string | null;
}
