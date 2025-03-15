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
import { Public } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards';
import { DeleteResponse } from '../shared/dto/custom-responses';
import { BlogService } from './blog.service';
import {
  CreateBlogDto,
  CreateBlogSuccessResponse,
  GetBlogsDto,
  GetBlogsSuccessResponse,
  GetBlogSuccessResponse,
  UpdateBlogDto,
  UpdateBlogSuccessResponse,
} from './dto';

@UseGuards(JwtAuthGuard)
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async create(@Body() payload: CreateBlogDto) {
    const blog = await this.blogService.create(payload);

    return new CreateBlogSuccessResponse(blog);
  }

  @Public()
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
    @Body() payload: GetBlogsDto,
  ) {
    const blogs = await this.blogService.findAll(query, payload);

    return new GetBlogsSuccessResponse(blogs);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const blog = await this.blogService.findOne(id);

    return new GetBlogSuccessResponse(blog);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateBlogDto,
  ) {
    const blog = await this.blogService.update(id, payload);

    return new UpdateBlogSuccessResponse(blog);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.blogService.remove(id);

    return new DeleteResponse('delete blog success');
  }
}
