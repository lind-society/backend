import { HttpStatus } from '@nestjs/common';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { BlogWithRelationsDto } from './blog.dto';
import { CreateBlogDto } from './create-blog.dto';

export class UpdateBlogDto extends PartialType(
  OmitType(CreateBlogDto, ['authorId'] as const),
) {}

export class UpdateBlogSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BlogWithRelationsDto>
{
  readonly data: BlogWithRelationsDto;

  constructor(data: BlogWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'update blog success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
