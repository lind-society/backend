import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { JwtAuthGuard } from 'src/modules/auth/guards';
import { DeleteResponse } from 'src/modules/shared/dto/custom-responses';
import { BlogCategoryService } from './blog-category.service';
import {
  CreateBlogCategoryDto,
  CreateBlogCategorySuccessResponse,
  GetBlogCategoriesSuccessResponse,
  GetBlogCategorySuccessResponse,
  UpdateBlogCategoryDto,
  UpdateBlogCategorySuccessResponse,
} from './dto';

@UseGuards(JwtAuthGuard)
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
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const blogCategory = await this.blogCategoryService.findOne(id);

    return new GetBlogCategorySuccessResponse(blogCategory);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBlogDto: UpdateBlogCategoryDto,
  ) {
    const blogCategory = await this.blogCategoryService.update(
      id,
      updateBlogDto,
    );

    return new UpdateBlogCategorySuccessResponse(blogCategory);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.blogCategoryService.remove(id);

    return new DeleteResponse('delete blog category success');
  }
}
