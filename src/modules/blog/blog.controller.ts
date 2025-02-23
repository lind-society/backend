import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { DeleteResponse } from '../shared/dto';
import { BlogService } from './blog.service';
import {
  GetBlogsDto,
  GetBlogsSuccessResponse,
  GetBlogSuccessResponse,
} from './dto';
import {
  CreateBlogDto,
  CreateBlogSuccessResponse,
} from './dto/create-blog.dto';
import {
  UpdateBlogDto,
  UpdateBlogSuccessResponse,
} from './dto/update-blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async create(@Body() payload: CreateBlogDto) {
    console.log('payload');
    const blog = await this.blogService.create(payload);

    return new CreateBlogSuccessResponse(blog);
  }

  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
    @Body() payload: GetBlogsDto,
  ) {
    const blogs = await this.blogService.findAll(query, payload);

    return new GetBlogsSuccessResponse(blogs);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const blog = await this.blogService.findOne(id);

    return new GetBlogSuccessResponse(blog);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateBlogDto) {
    const blog = await this.blogService.update(id, payload);

    return new UpdateBlogSuccessResponse(blog);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.blogService.remove(id);

    return new DeleteResponse('delete blog success');
  }
}
