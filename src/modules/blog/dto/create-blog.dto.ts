import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { BlogWithRelationsDto } from './blog.dto';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  readonly title!: string;

  @IsString()
  @IsNotEmpty()
  readonly content?: string | null;

  // Should be not null (updated when adding admin entity)
  @IsUUID()
  @IsOptional()
  readonly authorId?: string | null;

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
