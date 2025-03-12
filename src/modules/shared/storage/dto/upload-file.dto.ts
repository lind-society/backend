import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { FileDto } from './file.dto';

export class UploadFileDto {
  @IsString()
  @IsNotEmpty()
  readonly key!: string;

  @IsString()
  @IsOptional()
  readonly bucket?: string | null;
}

export class UploadFileSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<FileDto>
{
  readonly data: FileDto;

  constructor(data: FileDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'upload file success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
