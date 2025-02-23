import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { Blog, BlogCategory } from 'src/database/entities';
import { DataSource, Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import {
  BlogDto,
  BlogWithRelationsDto,
  CreateBlogDto,
  GetBlogsDto,
  UpdateBlogDto,
} from './dto';

@Injectable()
export class BlogService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    @InjectRepository(BlogCategory)
    private blogCategoryRepository: Repository<BlogCategory>,
  ) {}

  private async _validateCategory(categoryId: string): Promise<void> {
    const validCategory = await this.blogCategoryRepository.findOne({
      where: {
        id: categoryId,
      },
    });

    if (!validCategory) {
      throw new NotFoundException('Blog category not found');
    }
  }

  async create(payload: CreateBlogDto): Promise<BlogWithRelationsDto> {
    console.log(payload);
    await this._validateCategory(payload.categoryId);

    const createdBlog = this.blogRepository.create(payload);

    return await this.blogRepository.save(createdBlog);
  }

  async findAll(
    query: PaginateQuery,
    payload: GetBlogsDto,
  ): Promise<PaginateResponseDataProps<BlogDto[]>> {
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

    const mappedBlogData: BlogDto[] = paginatedBlog.data.map(
      ({ category, ...blogData }) => ({
        ...blogData,
        category,
      }),
    ) as BlogWithRelationsDto[];

    return paginateResponseMapper(paginatedBlog, mappedBlogData);
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

    console.log(blog);

    return blog;
  }

  async update(
    id: string,
    payload: UpdateBlogDto,
  ): Promise<BlogWithRelationsDto> {
    await this.findOne(id);

    if (payload.categoryId) {
      await this._validateCategory(payload.categoryId);
    }

    await this.blogRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.blogRepository.delete(id);
  }
}
