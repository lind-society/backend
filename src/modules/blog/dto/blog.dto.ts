import { Blog } from 'src/database/entities';
import { BlogCategoryDto } from '../category/dto';

export interface IBlogDto extends Omit<Blog, 'category'> {}

export interface IBlogWithRelationsDto extends IBlogDto {
  category: BlogCategoryDto;
}

export class BlogDto implements IBlogDto {
  readonly id!: string;
  readonly title!: string;
  readonly content!: string;
  readonly authorId!: string | null;
  readonly categoryId!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class BlogWithRelationsDto
  extends BlogDto
  implements IBlogWithRelationsDto
{
  readonly category!: BlogCategoryDto;
}
