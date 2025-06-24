import { HalEmbedded, Public } from '@apps/main/common/decorators';
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
@HalEmbedded(
  { name: 'activityBooking', path: 'bookings/activities' },
  { name: 'customer', path: 'booking-customers' },
  { name: 'villaBooking', path: 'bookings/villas' },
  { name: 'activity', path: 'activities' },
  { name: 'villa', path: 'villas' },
  { name: 'owner', path: 'owners' },
)
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
