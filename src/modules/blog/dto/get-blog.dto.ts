import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
import { BlogDto } from './blog.dto';

export class GetBlogParamsDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}

export class GetBlogsDto {
  @IsUUID()
  @IsOptional()
  categoryId?: string;
}

export class GetBlogPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: BlogDto[];
}

export class GetBlogsSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetBlogPaginateDto>
{
  readonly data: GetBlogPaginateDto;

  constructor(data: GetBlogPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get blogs success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetBlogSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BlogDto>
{
  readonly data: BlogDto;

  constructor(data: BlogDto) {
    super({
      code: HttpStatus.OK,
      message: 'get blog success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
