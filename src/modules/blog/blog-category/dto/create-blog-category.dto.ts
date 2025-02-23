import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
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
