import { Public } from '@apps/main/common/decorators';
import { PriceConverterInterceptor } from '@apps/main/common/interceptors';
import { JwtAuthGuard } from '@apps/main/modules/auth/guards';
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
import { DeleteResponse } from '../../shared/dto/custom-responses';
import { ActivityBookingService } from './activity-booking.service';
import {
  CreateActivityBookingDto,
  CreateActivityBookinguccessResponse,
  GetActivityBookingsSuccessResponse,
  GetActivityBookingSuccessResponse,
  UpdateActivityBookingDto,
  UpdateActivityBookingSuccessResponse,
} from './dto';

@UseGuards(JwtAuthGuard)
@UseInterceptors(PriceConverterInterceptor)
@Controller('bookings/activities')
export class ActivityBookingController {
  constructor(
    private readonly activityBookingService: ActivityBookingService,
  ) {}

  @Post()
  async create(@Body() payload: CreateActivityBookingDto) {
    const booking = await this.activityBookingService.create(payload);

    return new CreateActivityBookinguccessResponse(booking);
  }

  @Public()
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const bookings = await this.activityBookingService.findAll(query);

    return new GetActivityBookingsSuccessResponse(bookings);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const booking = await this.activityBookingService.findOne(id);

    return new GetActivityBookingSuccessResponse(booking);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateActivityBookingDto: UpdateActivityBookingDto,
  ) {
    const booking = await this.activityBookingService.update(
      id,
      updateActivityBookingDto,
    );

    return new UpdateActivityBookingSuccessResponse(booking);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.activityBookingService.remove(id);

    return new DeleteResponse('delete activity booking success');
  }
}
