import { HttpStatus } from '@nestjs/common';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { BlogWithRelationsDto } from './blog.dto';
import { CreateBlogDto } from './create-blog.dto';

export class UpdateBlogDto extends PartialType(
  OmitType(CreateBlogDto, ['authorId'] as const),
) {
  @IsString()
  @IsOptional()
  readonly title?: string | null;

  @IsString()
  @IsOptional()
  readonly content?: string | null;

  @IsUUID()
  @IsOptional()
  readonly categoryId?: string | null;
}

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
