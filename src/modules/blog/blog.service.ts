import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { Blog } from 'src/database/entities';
import { Repository } from 'typeorm';
import { AdminService } from '../admin/admin.service';
import { PaginateResponseDataProps } from '../shared/dto';
import { BlogCategoryService } from './category/blog-category.service';
import { BlogWithRelationsDto, CreateBlogDto, UpdateBlogDto } from './dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    private adminService: AdminService,
    private blogCategoryService: BlogCategoryService,
  ) {}

  async create(payload: CreateBlogDto): Promise<BlogWithRelationsDto> {
    await this._validateRelatedEntities(payload.authorId, payload.categoryId);

    const createdBlog = this.blogRepository.create(payload);

    return await this.blogRepository.save(createdBlog);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<BlogWithRelationsDto[]>> {
    const paginatedBlog = await paginate(query, this.blogRepository, {
      sortableColumns: ['createdAt', 'title', 'authorId', 'categoryId'],
      defaultSortBy: [['createdAt', 'DESC']],
      nullSort: 'last',
      defaultLimit: 10,
      maxLimit: 100,
      filterableColumns: {
        categoryId: [FilterOperator.EQ],
        authorId: [FilterOperator.EQ],
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],
      },
      searchableColumns: ['title', 'category.name'],
      relations: {
        author: true,
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
        author: true,
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

    await this._validateRelatedEntities(null, payload.categoryId);

    await this.blogRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.blogRepository.delete(id);
  }

  private async _validateRelatedEntities(
    authorId?: string,
    categoryId?: string,
  ): Promise<void> {
    if (categoryId) {
      await this.blogCategoryService.findOne(categoryId);
    }

    if (authorId) {
      await this.adminService.findOne(authorId);
    }
  }
}
