import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { BlogPaginationDto, BlogWithRelationsDto } from './blog.dto';

export class GetBlogPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: BlogPaginationDto[];
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
