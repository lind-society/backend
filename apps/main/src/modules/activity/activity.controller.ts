import { Public } from '@apps/main/common/decorators';
import { PriceConverterInterceptor } from '@apps/main/common/interceptors';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { JwtAuthGuard } from '../auth/guards';
import { DeleteResponse } from '../shared/dto/custom-responses';
import { ActivityService } from './activity.service';
import {
  CreateActivityDto,
  CreateActivitySuccessResponse,
  GetActivitiesSuccessResponse,
  GetActivityBestSellerQueryDto,
  GetActivityBestSellerSuccessResponse,
  GetActivitySuccessResponse,
  UpdateActivityDto,
  UpdateActivitySuccessResponse,
} from './dto';

@UseGuards(JwtAuthGuard)
@Controller('activities')
@UseInterceptors(PriceConverterInterceptor)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  async create(@Body() payload: CreateActivityDto) {
    const result = await this.activityService.create(payload);

    return new CreateActivitySuccessResponse(result);
  }

  @Public()
  @Get('/best-seller')
  async findBestSeller(@Query() query: GetActivityBestSellerQueryDto) {
    const result = await this.activityService.findBestSeller(query.option);

    return new GetActivityBestSellerSuccessResponse(result, query.option);
  }

  @Public()
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.activityService.findAll(query);

    return new GetActivitiesSuccessResponse(result);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.activityService.findOne(id);

    return new GetActivitySuccessResponse(result);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateActivityDto,
  ) {
    const result = await this.activityService.update(id, payload);

    return new UpdateActivitySuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.activityService.remove(id);

    return new DeleteResponse('delete activity success');
  }
}
