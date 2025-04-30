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
import { Public } from 'src/common/decorators';
import { PriceConverterInterceptor } from 'src/common/interceptors';
import { DeleteResponse } from '../shared/dto/custom-responses';
import { ActivityService } from './activity.service';
import {
  CreateActivityDto,
  CreateActivitySuccessResponse,
  GetActivitiesSuccessResponse,
  GetActivitySuccessResponse,
  UpdateActivityDto,
  UpdateActivitySuccessResponse,
} from './dto';
import { JwtAuthGuard } from '../auth/guards';

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
