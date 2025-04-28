import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PriceConverterInterceptor } from 'src/common/interceptors';
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

@UseInterceptors(PriceConverterInterceptor)
@Controller('bookings/villas')
export class VillaBookingController {
  constructor(private readonly villaBookingService: VillaBookingService) {}

  @Post()
  async create(@Body() payload: CreateVillaBookingDto) {
    const booking = await this.villaBookingService.create(payload);

    return new CreateVillaBookinguccessResponse(booking);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const bookings = await this.villaBookingService.findAll(query);

    return new GetVillaBookingsSuccessResponse(bookings);
  }

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
