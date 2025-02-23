import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BlogCategoryService } from './blog-category.service';
import {
  BlogCategoryParamsDto,
  CreateBlogCategoryDto,
  CreateBlogCategorySuccessResponse,
  GetBlogCategoriesSuccessResponse,
  GetBlogCategorySuccessResponse,
  UpdateBlogCategoryDto,
  UpdateBlogCategorySuccessResponse,
} from './dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { DeleteResponse } from 'src/modules/shared/dto';

@Controller('blog-categories')
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}

  @Post()
  async create(@Body() payload: CreateBlogCategoryDto) {
    const blogCategory = await this.blogCategoryService.create(payload);

    return new CreateBlogCategorySuccessResponse(blogCategory);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const categories = await this.blogCategoryService.findAll(query);

    return new GetBlogCategoriesSuccessResponse(categories);
  }

  @Get(':id')
  async findOne(@Param() params: BlogCategoryParamsDto) {
    const blogCategory = await this.blogCategoryService.findOne(params.id);

    return new GetBlogCategorySuccessResponse(blogCategory);
  }

  @Patch(':id')
  async update(
    @Param() params: BlogCategoryParamsDto,
    @Body() updateBlogDto: UpdateBlogCategoryDto,
  ) {
    const blogCategory = await this.blogCategoryService.update(
      params.id,
      updateBlogDto,
    );

    return new UpdateBlogCategorySuccessResponse(blogCategory);
  }

  @Delete(':id')
  async remove(@Param() params: BlogCategoryParamsDto) {
    await this.blogCategoryService.remove(params.id);

    return new DeleteResponse('delete blog category success');
  }
}
