import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogCategory } from 'src/database/entities';
import { Repository } from 'typeorm';
import {
  BlogCategoryDto,
  BlogCategoryWithRelationsDto,
  CreateBlogCategoryDto,
} from './dto';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginateResponseDataProps } from 'src/modules/shared/dto';
import { paginateResponseMapper } from 'src/common/helpers';
import { UpdateFacilityDto } from 'src/modules/facility/dto';

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
  ): Promise<PaginateResponseDataProps<BlogCategoryDto[]>> {
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

    const mappedBlogCategoryData: BlogCategoryDto[] =
      paginatedBlogCategory.data.map(({ blogs, ...blogCategory }) => ({
        ...blogCategory,
        blogs: blogs.map((blog) => ({
          ...blog,
        })),
      }));

    return paginateResponseMapper(
      paginatedBlogCategory,
      mappedBlogCategoryData,
    );
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
    payload: UpdateFacilityDto,
  ): Promise<BlogCategoryDto> {
    await this.findOne(id);

    await this.blogCateogryRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.blogCateogryRepository.delete(id);
  }
}
