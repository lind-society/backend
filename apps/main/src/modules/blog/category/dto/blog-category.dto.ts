import { Blog, BlogCategory } from '@apps/main/database/entities';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { BlogWithRelationsDto, RelatedBlogDto } from '../../dto';

export interface IBlogCategoryDto extends Omit<BlogCategory, 'blogs'> {}

export interface IBlogCategoryWithRelationsDto extends IBlogCategoryDto {
  blogs?: BlogWithRelationsDto[];
}

export interface IBlogCategoryPaginationDto
  extends Omit<BlogCategory, 'updatedAt' | 'deletedAt' | 'blogs'> {
  blogs?: RelatedBlogDto[];
}

export interface IRelatedBlogCategoryDto
  extends Pick<BlogCategory, 'id' | 'name'> {}

export class BlogCategoryDto implements IBlogCategoryDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: BlogCategory): BlogCategoryDto {
    return plainToInstance(BlogCategoryDto, entity);
  }

  static fromEntities(entities: BlogCategory[]): BlogCategoryDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class BlogCategoryWithRelationsDto
  extends BlogCategoryDto
  implements IBlogCategoryDto
{
  @Expose()
  blogs?: BlogWithRelationsDto[];

  static fromEntity(
    entity: BlogCategory & {
      blogs: Blog[];
    },
  ): BlogCategoryWithRelationsDto {
    const dto = plainToInstance(BlogCategoryWithRelationsDto, entity);

    if (entity.blogs) {
      dto.blogs = BlogWithRelationsDto.fromEntities(entity.blogs);
    }

    return dto;
  }

  static fromEntities(
    entities: (BlogCategory & {
      blogs?: Blog[];
    })[],
  ): BlogCategoryWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class BlogCategoryPaginationDto implements IBlogCategoryPaginationDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  blogs?: RelatedBlogDto[];

  static fromEntity(
    entity: BlogCategory & {
      blogs: Blog[];
    },
  ): BlogCategoryPaginationDto {
    const dto = plainToInstance(BlogCategoryPaginationDto, entity);

    if (entity.blogs) {
      dto.blogs = RelatedBlogDto.fromEntities(entity.blogs);
    }

    return dto;
  }

  static fromEntities(
    entities: (BlogCategory & {
      blogs?: Blog[];
    })[],
  ): BlogCategoryPaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedBlogCategoryDto implements IRelatedBlogCategoryDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  static fromEntity(entity: BlogCategory): RelatedBlogCategoryDto {
    return plainToInstance(RelatedBlogCategoryDto, entity);
  }

  static fromEntities(entities: BlogCategory[]): RelatedBlogCategoryDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
