import { HalEmbedded, Public } from '@apps/main/common/decorators';
import { HalInterceptor } from '@apps/main/common/interceptors';
import { AuthorizedRequest } from '@apps/main/common/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { JwtAuthGuard } from '../auth/guards';
import { DeleteResponse } from '../shared/dto/custom-responses';
import { BlogService } from './blog.service';
import {
  CreateBlogDto,
  CreateBlogSuccessResponse,
  GetBlogsSuccessResponse,
  GetBlogSuccessResponse,
  UpdateBlogDto,
  UpdateBlogSuccessResponse,
} from './dto';

@UseGuards(JwtAuthGuard)
@HalEmbedded(
  { name: 'author', path: 'admins' },
  { name: 'category', path: 'blog-categories' },
)
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async create(
    @Request() req: AuthorizedRequest,
    @Body() payload: CreateBlogDto,
  ) {
    const result = await this.blogService.create({
      ...payload,
      authorId: req.user.id,
    });

    return new CreateBlogSuccessResponse(result);
  }

  @Public()
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.blogService.findAll(query);

    return new GetBlogsSuccessResponse(result);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.blogService.findOne(id);

    return new GetBlogSuccessResponse(result);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateBlogDto,
  ) {
    const result = await this.blogService.update(id, payload);

    return new UpdateBlogSuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.blogService.remove(id);

    return new DeleteResponse('delete blog success');
  }
}
