import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { Blog } from 'src/database/entities';
import { Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import { BlogCategoryService } from './category/blog-category.service';
import {
  BlogWithRelationsDto,
  CreateBlogDto,
  GetBlogsDto,
  UpdateBlogDto,
} from './dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    private blogCategoryService: BlogCategoryService,
  ) {}

  async create(payload: CreateBlogDto): Promise<BlogWithRelationsDto> {
    await this.blogCategoryService.findOne(payload.categoryId);

    const createdBlog = this.blogRepository.create(payload);

    return await this.blogRepository.save(createdBlog);
  }

  async findAll(
    query: PaginateQuery,
    payload: GetBlogsDto,
  ): Promise<PaginateResponseDataProps<BlogWithRelationsDto[]>> {
    const whereCondition = payload.categoryId
      ? { categoryId: payload.categoryId }
      : undefined;

    const paginatedBlog = await paginate(query, this.blogRepository, {
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      defaultLimit: 10,
      searchableColumns: ['title', 'category.name'],
      where: whereCondition,
      relations: {
        category: true,
      },
    });

    return paginateResponseMapper(paginatedBlog);
  }

  async findOne(id: string): Promise<BlogWithRelationsDto> {
    const blog = await this.blogRepository.findOne({
      where: {
        id,
      },
      relations: {
        category: true,
      },
    });

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    return blog;
  }

  async update(
    id: string,
    payload: UpdateBlogDto,
  ): Promise<BlogWithRelationsDto> {
    await this.findOne(id);

    if (payload.categoryId) {
      await this.blogCategoryService.findOne(payload.categoryId);
    }

    await this.blogRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.blogRepository.delete(id);
  }
}
