import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { BlogWithRelationsDto } from './blog.dto';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  readonly title!: string;

  @IsString()
  @IsNotEmpty()
  readonly content!: string;

  @IsUUID()
  @IsOptional()
  readonly authorId?: string;

  @IsUUID()
  @IsNotEmpty()
  readonly categoryId!: string;
}

export class CreateBlogSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BlogWithRelationsDto>
{
  readonly data: BlogWithRelationsDto;

  constructor(data: BlogWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create blog success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
