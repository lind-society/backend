import { Public } from '@apps/main/common/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { DeleteResponse } from '../shared/dto/custom-responses';
import { BookingService } from './booking.service';
import {
  CreateBookingDto,
  CreateBookingSuccessResponse,
  GetBookingsSuccessResponse,
  GetBookingSuccessResponse,
  UpdateBookingDto,
  UpdateBookingSuccessResponse,
} from './dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(@Body() payload: CreateBookingDto) {
    const booking = await this.bookingService.create(payload);

    return new CreateBookingSuccessResponse(booking, payload.type);
  }

  @Public()
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const bookings = await this.bookingService.findAll(query);

    return new GetBookingsSuccessResponse(bookings);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const booking = await this.bookingService.findOne(id);

    return new GetBookingSuccessResponse(booking);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    const booking = await this.bookingService.update(id, updateBookingDto);

    return new UpdateBookingSuccessResponse(booking);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.bookingService.remove(id);

    return new DeleteResponse('delete booking success');
  }
}
