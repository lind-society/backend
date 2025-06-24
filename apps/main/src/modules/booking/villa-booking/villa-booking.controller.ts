import {
  HalEmbedded,
  HalEntityType,
  Public,
} from '@apps/main/common/decorators';
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
import {
  CreateVillaBookingDto,
  CreateVillaBookinguccessResponse,
  GetVillaBookingsSuccessResponse,
  GetVillaBookingSuccessResponse,
  UpdateVillaBookingDto,
  UpdateVillaBookingSuccessResponse,
} from './dto';
import { VillaBookingService } from './villa-booking.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(PriceConverterInterceptor)
@HalEntityType('bookings/villas')
@HalEmbedded(
  { name: 'payment', path: 'booking-payments' },
  { name: 'customer', path: 'booking-customers' },
  { name: 'owner', path: 'owners' },
  { name: 'activity', path: 'activities' },
  { name: 'category', path: 'activity-categories' },
)
@Controller('bookings/villas')
export class VillaBookingController {
  constructor(private readonly villaBookingService: VillaBookingService) {}

  @Post()
  async create(@Body() payload: CreateVillaBookingDto) {
    const booking = await this.villaBookingService.create(payload);

    return new CreateVillaBookinguccessResponse(booking);
  }

  @Public()
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const bookings = await this.villaBookingService.findAll(query);

    return new GetVillaBookingsSuccessResponse(bookings);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const booking = await this.villaBookingService.findOne(id);

    return new GetVillaBookingSuccessResponse(booking);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVillaBookingDto: UpdateVillaBookingDto,
  ) {
    const booking = await this.villaBookingService.update(
      id,
      updateVillaBookingDto,
    );

    return new UpdateVillaBookingSuccessResponse(booking);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.villaBookingService.remove(id);

    return new DeleteResponse('delete villa booking success');
  }
}
