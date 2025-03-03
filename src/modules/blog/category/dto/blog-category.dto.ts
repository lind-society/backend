import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BlogCategory } from 'src/database/entities';
import { BlogDto } from '../../dto';

export interface IBlogCategoryDto extends Omit<BlogCategory, 'blogs'> {}

export interface IBlogCategoryWithRelationsDto extends IBlogCategoryDto {
  blogs: BlogDto[];
}

export class BlogCategoryDto implements IBlogCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  readonly id!: string;

  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsDate()
  @IsNotEmpty()
  readonly createdAt!: Date;

  @IsDate()
  @IsOptional()
  readonly updatedAt!: Date | null;

  @IsDate()
  @IsOptional()
  readonly deletedAt!: Date | null;
}

export class BlogCategoryWithRelationsDto
  extends BlogCategoryDto
  implements IBlogCategoryDto
{
  readonly blogs?: BlogDto[];
}
