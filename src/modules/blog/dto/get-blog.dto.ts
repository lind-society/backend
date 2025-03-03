import { HttpStatus } from '@nestjs/common';
import { IsOptional, IsUUID } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
import { BlogWithRelationsDto } from './blog.dto';

export class GetBlogsDto {
  @IsUUID()
  @IsOptional()
  categoryId?: string;
}

export class GetBlogPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: BlogWithRelationsDto[];
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
  implements HttpResponseOptions<BlogWithRelationsDto>
{
  readonly data: BlogWithRelationsDto;

  constructor(data: BlogWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'get blog success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
