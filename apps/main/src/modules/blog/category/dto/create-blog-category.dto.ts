import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { BlogCategoryWithRelationsDto } from './blog-category.dto';

export class CreateBlogCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;
}

export class CreateBlogCategorySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BlogCategoryWithRelationsDto>
{
  readonly data: BlogCategoryWithRelationsDto;

  constructor(data: BlogCategoryWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create blog category success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
