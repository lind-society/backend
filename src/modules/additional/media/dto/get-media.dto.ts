import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
import { MediaDto } from './media.dto';

export class GetMediaParamsDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}

export class GetMediasDto {
  @IsUUID()
  @IsOptional()
  additionalId?: string | null;
}

export class GetMediaPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: MediaDto[];
}

export class GetMediasSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetMediaPaginateDto>
{
  readonly data: GetMediaPaginateDto;

  constructor(data: GetMediaPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get medias success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetMediaSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<MediaDto>
{
  readonly data: MediaDto;

  constructor(data: MediaDto) {
    super({
      code: HttpStatus.OK,
      message: 'get media success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
