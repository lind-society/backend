import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { BlogCategory } from 'src/database/entities';
import { PaginateResponseDataProps } from 'src/modules/shared/dto';
import { Repository } from 'typeorm';
import {
  BlogCategoryDto,
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
  async create(payload: CreateBlogCategoryDto): Promise<BlogCategoryDto> {
    const blogCategory = this.blogCateogryRepository.create(payload);

    return await this.blogCateogryRepository.save(blogCategory);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<BlogCategoryWithRelationsDto[]>> {
    const paginatedBlogCategory = await paginate(
      query,
      this.blogCateogryRepository,
      {
        sortableColumns: ['createdAt'],
        defaultSortBy: [['createdAt', 'DESC']],
        defaultLimit: 10,
        searchableColumns: ['name'],
        relations: { blogs: true },
      },
    );

    return paginateResponseMapper(paginatedBlogCategory);
  }

  async findOne(id: string): Promise<BlogCategoryWithRelationsDto> {
    const blogCategory = await this.blogCateogryRepository.findOne({
      where: {
        id,
      },
      relations: {
        blogs: true,
      },
    });

    if (!blogCategory) {
      throw new NotFoundException('blog category not found');
    }

    const { blogs, ...blogCategoryData } = blogCategory;

    return {
      ...blogCategoryData,
      blogs: blogs.map((blog) => ({
        ...blog,
      })),
    };
  }

  async update(
    id: string,
    payload: UpdateBlogCategoryDto,
  ): Promise<BlogCategoryDto> {
    await this.findOne(id);

    await this.blogCateogryRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.blogCateogryRepository.delete(id);
  }
}
