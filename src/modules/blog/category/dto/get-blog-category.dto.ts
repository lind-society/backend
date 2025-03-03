import { HttpStatus } from '@nestjs/common';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
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
