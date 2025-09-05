import { paginateResponseMapper } from '@apps/main/common/helpers';
import { Blog } from '@apps/main/database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import {
  BlogPaginationDto,
  BlogWithRelationsDto,
  CreateBlogDto,
  UpdateBlogDto,
} from './dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  async create(payload: CreateBlogDto): Promise<BlogWithRelationsDto> {
    const blogEntity = this.blogRepository.create(payload);

    const createdBlog = await this.blogRepository.save(blogEntity);

    return BlogWithRelationsDto.fromEntity(createdBlog);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<BlogPaginationDto[]>> {
    const paginatedBlogs = await paginate(query, this.blogRepository, {
      select: [
        'id',
        'title',
        'content',
        'createdAt',
        'category.id',
        'category.name',
        'author.id',
        'author.name',
      ],
      sortableColumns: ['createdAt', 'title'],
      defaultSortBy: [['createdAt', 'DESC']],
      nullSort: 'last',
      defaultLimit: 10,
      maxLimit: 100,
      filterableColumns: {
        categoryId: [FilterOperator.EQ],
        authorId: [FilterOperator.EQ],
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],
      },
      searchableColumns: ['title'],
      relations: {
        author: true,
        category: true,
      },
    });

    const blogs = BlogPaginationDto.fromEntities(paginatedBlogs.data);

    return paginateResponseMapper(paginatedBlogs, blogs);
  }

  async findOne(id: string): Promise<BlogWithRelationsDto> {
    const blog = await this.blogRepository.findOne({
      select: {
        id: true,
        title: true,
        content: true,
        category: {
          id: true,
          name: true,
        },
        author: {
          id: true,
          name: true,
        },
      },
      where: {
        id,
      },
      relations: {
        author: true,
        category: true,
      },
    });

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    return BlogWithRelationsDto.fromEntity(blog);
  }

  async update(
    id: string,
    payload: UpdateBlogDto,
  ): Promise<BlogWithRelationsDto> {
    await this.validateExist(id);

    await this.blogRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.validateExist(id);

    await this.blogRepository.delete(id);
  }

  async validateExist(id: string): Promise<void> {
    const exists = await this.blogRepository.exists({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('blog not found');
    }
  }
}
