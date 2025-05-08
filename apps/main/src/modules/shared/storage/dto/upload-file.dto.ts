import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FailedUploadFileDto, FileDto } from './file.dto';

export class UploadFileRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly key!: string;

  @IsString()
  @IsOptional()
  readonly bucket?: string;
}

export class UploadFilesResponseDto {
  successFiles: FileDto[];
  failedFiles: FailedUploadFileDto[];
}

export class UploadFileSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<UploadFilesResponseDto>
{
  readonly data: UploadFilesResponseDto;

  constructor(data: UploadFilesResponseDto) {
    const hasFailedFiles = data.failedFiles.length > 0;

    super({
      code: hasFailedFiles ? HttpStatus.BAD_REQUEST : HttpStatus.CREATED,
      message: hasFailedFiles ? 'upload file failed' : 'upload file success',
      status: hasFailedFiles
        ? DefaultHttpStatus.Fail
        : DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
