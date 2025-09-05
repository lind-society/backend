import { generateShortDescription } from '@apps/main/common/helpers';
import { Admin, Blog, BlogCategory } from '@apps/main/database/entities';
import {
  AdminWithRelationsDto,
  RelatedAdminDto,
} from '@apps/main/modules/admin/dto';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import {
  BlogCategoryWithRelationsDto,
  RelatedBlogCategoryDto,
} from '../category/dto';

export interface IBlogDto extends Omit<Blog, 'category' | 'author'> {}

export interface IBlogWithRelationsDto extends IBlogDto {
  category?: BlogCategoryWithRelationsDto;
  author?: AdminWithRelationsDto;
}

export interface IBlogPaginationDto
  extends Omit<
    Blog,
    | 'updatedAt'
    | 'deletedAt'
    | 'categoryId'
    | 'authorId'
    | 'category'
    | 'author'
  > {
  category?: RelatedBlogCategoryDto;
  author?: RelatedAdminDto;
}

export interface IRelatedBlogDto extends Pick<Blog, 'id' | 'title'> {
  category?: RelatedBlogCategoryDto;
  author?: RelatedAdminDto;
}

export class BlogDto implements IBlogDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly title!: string;

  @Expose()
  readonly content!: string;

  @Expose()
  readonly authorId!: string;

  @Expose()
  readonly categoryId!: string;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: Blog): BlogDto {
    return plainToInstance(BlogDto, entity);
  }

  static fromEntities(entities: Blog[]): BlogDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class BlogWithRelationsDto
  extends BlogDto
  implements IBlogWithRelationsDto
{
  @Expose()
  category?: BlogCategoryWithRelationsDto;

  @Expose()
  author?: AdminWithRelationsDto;

  static fromEntity(
    entity: Blog & {
      category: BlogCategory;
      author: Admin;
    },
  ): BlogWithRelationsDto {
    const dto = plainToInstance(BlogWithRelationsDto, entity);

    if (entity.category) {
      dto.category = BlogCategoryWithRelationsDto.fromEntity(entity.category);
    }

    if (entity.author) {
      dto.author = AdminWithRelationsDto.fromEntity(entity.author);
    }

    return dto;
  }

  static fromEntities(
    entities: (Blog & {
      category: BlogCategory;
      author: Admin;
    })[],
  ): BlogWithRelationsDto[] {
    return entities.map((entity) => ({
      ...this.fromEntity(entity),
      content: generateShortDescription(entity.content),
    }));
  }
}

export class BlogPaginationDto implements IBlogPaginationDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly title!: string;

  @Expose()
  readonly content!: string;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  category?: RelatedBlogCategoryDto;

  @Expose()
  author?: RelatedAdminDto;

  static fromEntity(
    entity: Blog & { category: BlogCategory; author: Admin },
  ): BlogPaginationDto {
    const dto = plainToInstance(BlogPaginationDto, entity);

    if (entity.author) {
      dto.author = RelatedAdminDto.fromEntity(entity.author);
    }

    if (entity.category) {
      dto.category = RelatedBlogCategoryDto.fromEntity(entity.category);
    }

    return dto;
  }

  static fromEntities(
    entities: (Blog & { category: BlogCategory; author: Admin })[],
  ): BlogPaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedBlogDto implements IRelatedBlogDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly title!: string;

  @Expose()
  author!: RelatedAdminDto;

  @Expose()
  category!: RelatedBlogCategoryDto;

  static fromEntity(
    entity: Blog & { category: BlogCategory; author: Admin },
  ): RelatedBlogDto {
    const dto = plainToInstance(RelatedBlogDto, entity);

    if (entity.author) {
      dto.author = RelatedAdminDto.fromEntity(entity.author);
    }

    if (entity.category) {
      dto.category = RelatedBlogCategoryDto.fromEntity(entity.category);
    }

    return dto;
  }

  static fromEntities(
    entities: (Blog & { category: BlogCategory; author: Admin })[],
  ): RelatedBlogDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
