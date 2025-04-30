import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import { HttpResponseDefaultProps, HttpResponseOptions } from '../../dto';
import { FileDto } from './file.dto';

export class GetFileUrlDto {
  @IsString()
  @IsNotEmpty()
  readonly key!: string;

  @IsString()
  @IsOptional()
  readonly bukcet?: string;
}

export class GetFileUrlSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<FileDto>
{
  readonly data: FileDto;

  constructor(data: FileDto) {
    super({
      code: HttpStatus.OK,
      message: 'get file success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
