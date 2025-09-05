import { paginateResponseMapper } from '@apps/main/common/helpers';
import { BlogCategory } from '@apps/main/database/entities';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import {
  BlogCategoryDto,
  BlogCategoryPaginationDto,
  BlogCategoryWithRelationsDto,
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
} from './dto';

@Injectable()
export class BlogCategoryService {
  constructor(
    @InjectRepository(BlogCategory)
    private blogCateogryRepository: Repository<BlogCategory>,
  ) {}

  async create(
    payload: CreateBlogCategoryDto,
  ): Promise<BlogCategoryWithRelationsDto> {
    const blogCategoryEntity = this.blogCateogryRepository.create(payload);

    const createdBlogCategory =
      await this.blogCateogryRepository.save(blogCategoryEntity);

    return BlogCategoryWithRelationsDto.fromEntity(createdBlogCategory);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<BlogCategoryPaginationDto[]>> {
    const paginatedBlogCategories = await paginate(
      query,
      this.blogCateogryRepository,
      {
        select: [
          'id',
          'name',
          'createdAt',

          'blogs.id',
          'blogs.title',
          'blogs.author.id',
          'blogs.author.name',
        ],
        sortableColumns: ['createdAt', 'name', 'blogs.id'],
        defaultSortBy: [['createdAt', 'DESC']],
        nullSort: 'last',
        defaultLimit: 10,
        maxLimit: 100,
        filterableColumns: {
          'blogs.id': [FilterOperator.EQ],
          createdAt: [FilterOperator.GTE, FilterOperator.LTE],
        },
        searchableColumns: ['name'],
        relations: { blogs: { author: true } },
      },
    );

    const blogCategories = BlogCategoryPaginationDto.fromEntities(
      paginatedBlogCategories.data,
    );

    return paginateResponseMapper(paginatedBlogCategories, blogCategories);
  }

  async findOne(id: string): Promise<BlogCategoryWithRelationsDto> {
    const blogCategory = await this.blogCateogryRepository.findOne({
      select: {
        id: true,
        name: true,
        blogs: {
          id: true,
          title: true,
          author: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        id,
      },
      relations: {
        blogs: { author: true },
      },
    });

    if (!blogCategory) {
      throw new NotFoundException('blog category not found');
    }

    return BlogCategoryWithRelationsDto.fromEntity(blogCategory);
  }

  async update(
    id: string,
    payload: UpdateBlogCategoryDto,
  ): Promise<BlogCategoryDto> {
    await this.validateExist(id);

    await this.blogCateogryRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.validateExist(id);

    await this.blogCateogryRepository.delete(id);
  }

  async validateExist(id: string): Promise<void> {
    const exists = await this.blogCateogryRepository.exists({ where: { id } });

    if (!exists) {
      throw new NotFoundException('blog category not found');
    }
  }
}
