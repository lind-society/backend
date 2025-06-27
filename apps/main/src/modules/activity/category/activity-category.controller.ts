import { HalEmbedded } from '@apps/main/common/decorators';
import { PriceConverterInterceptor } from '@apps/main/common/interceptors';
import { JwtAuthGuard } from '@apps/main/modules/auth/guards';
import { DeleteResponse } from '@apps/main/modules/shared/dto/custom-responses';
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
  UseInterceptors,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ActivityCategoryService } from './activity-category.service';
import {
  CreateActivityCategoryDto,
  CreateActivityCategorySuccessResponse,
  GetActivityCategoriesSuccessResponse,
  GetActivityCategorySuccessResponse,
  UpdateActivityCategoryDto,
  UpdateActivityCategorySuccessResponse,
} from './dto';

@UseGuards(JwtAuthGuard)
@UseInterceptors(PriceConverterInterceptor)
@HalEmbedded({ name: 'activities', path: 'activities' })
@Controller('activity-categories')
export class ActivityCategoryController {
  constructor(
    private readonly activityCategoryService: ActivityCategoryService,
  ) {}

  @Post()
  async create(@Body() payload: CreateActivityCategoryDto) {
    const activityCategory = await this.activityCategoryService.create(payload);

    return new CreateActivityCategorySuccessResponse(activityCategory);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const categories = await this.activityCategoryService.findAll(query);

    return new GetActivityCategoriesSuccessResponse(categories);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const activityCategory = await this.activityCategoryService.findOne(id);

    return new GetActivityCategorySuccessResponse(activityCategory);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateActivityDto: UpdateActivityCategoryDto,
  ) {
    const activityCategory = await this.activityCategoryService.update(
      id,
      updateActivityDto,
    );

    return new UpdateActivityCategorySuccessResponse(activityCategory);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.activityCategoryService.remove(id);

    return new DeleteResponse('delete activity category success');
  }
}
