import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { BlogCategoryDto } from './blog-category.dto';

export class GetBlogCategoriesPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: BlogCategoryDto[];
}

export class GetBlogCategoriesSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetBlogCategoriesPaginateDto>
{
  readonly data: GetBlogCategoriesPaginateDto;

  constructor(data: GetBlogCategoriesPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get blog categories success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetBlogCategorySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BlogCategoryDto>
{
  readonly data: BlogCategoryDto;

  constructor(data: BlogCategoryDto) {
    super({
      code: HttpStatus.OK,
      message: 'get blog category success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
