import { Blog } from '@apps/main/database/entities';
import { AdminDto } from '@apps/main/modules/admin/dto';
import { Type } from 'class-transformer';
import { BlogCategoryDto } from '../category/dto';

export interface IBlogDto extends Omit<Blog, 'category' | 'author'> {}

export interface IBlogWithRelationsDto extends IBlogDto {
  category?: BlogCategoryDto;
  author?: AdminDto;
}

export class BlogDto implements IBlogDto {
  readonly id!: string;
  readonly title!: string;
  readonly content!: string;
  readonly authorId!: string | null;
  readonly categoryId!: string | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class BlogWithRelationsDto
  extends BlogDto
  implements IBlogWithRelationsDto
{
  readonly category!: BlogCategoryDto;

  @Type(() => AdminDto)
  readonly author!: AdminDto;
}
