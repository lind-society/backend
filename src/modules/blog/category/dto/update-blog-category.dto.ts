import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { BlogCategoryDto } from './blog-category.dto';
import { CreateBlogCategoryDto } from './create-blog-category.dto';

export class UpdateBlogCategoryDto extends PartialType(CreateBlogCategoryDto) {}

export class UpdateBlogCategorySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BlogCategoryDto>
{
  readonly data: BlogCategoryDto;

  constructor(data: BlogCategoryDto) {
    super({
      code: HttpStatus.OK,
      message: 'update blog category success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
