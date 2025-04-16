import { BlogCategory } from '@apps/main/database/entities';
import { BlogDto } from '../../dto';

export interface IBlogCategoryDto extends Omit<BlogCategory, 'blogs'> {}

export interface IBlogCategoryWithRelationsDto extends IBlogCategoryDto {
  blogs: BlogDto[];
}

export class BlogCategoryDto implements IBlogCategoryDto {
  readonly id!: string;
  readonly name!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class BlogCategoryWithRelationsDto
  extends BlogCategoryDto
  implements IBlogCategoryDto
{
  readonly blogs?: BlogDto[];
}
