import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Public } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards';
import { DeleteResponse } from '../shared/dto/custom-responses';
import {
  CreateReviewDto,
  CreateReviewSuccessResponse,
  GetReviewsSuccessResponse,
  GetReviewSuccessResponse,
  UpdateReviewDto,
  UpdateReviewSuccessResponse,
} from './dto';
import { ReviewService } from './review.service';

@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(@Body() payload: CreateReviewDto) {
    const result = await this.reviewService.create(payload);

    return new CreateReviewSuccessResponse(result);
  }

  @Public()
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.reviewService.findAll(query);

    return new GetReviewsSuccessResponse(result);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.reviewService.findOne(id);

    return new GetReviewSuccessResponse(result);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateReviewDto) {
    const result = await this.reviewService.update(id, payload);

    return new UpdateReviewSuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.reviewService.remove(id);

    return new DeleteResponse('delete review success');
  }
}
