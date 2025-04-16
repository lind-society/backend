import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { BlogCategoryDto } from './blog-category.dto';

export class CreateBlogCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;
}

export class CreateBlogCategorySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BlogCategoryDto>
{
  readonly data: BlogCategoryDto;

  constructor(data: BlogCategoryDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create blog category success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
