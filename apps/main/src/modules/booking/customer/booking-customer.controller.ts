import { HalEmbedded, Public } from '@apps/main/common/decorators';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { BookingCustomerService } from './booking-customer.service';
import {
  GetBookingCustomersSuccessResponse,
  GetBookingCustomerSuccessResponse,
  UpdateBookingCustomerDto,
  UpdateBookingCustomerSuccessResponse,
} from './dto';

@HalEmbedded(
  { name: 'activityBookings', path: 'bookings/activities' },
  { name: 'villaBookings', path: 'bookings/villas' },
)
@Controller('bookings/:bookingId/customer')
export class BookingCustomerController {
  constructor(
    private readonly bookingCustomerService: BookingCustomerService,
  ) {}

  @Public()
  @Get()
  async findByBookingId(@Param('bookingId', ParseUUIDPipe) bookingId: string) {
    const bookingCustomer =
      await this.bookingCustomerService.findByBookingId(bookingId);

    return new GetBookingCustomersSuccessResponse(bookingCustomer);
  }

  @Public()
  @Get(':id')
  async findOne(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const bookingCustomer = await this.bookingCustomerService.findOne(
      bookingId,
      id,
    );

    return new GetBookingCustomerSuccessResponse(bookingCustomer);
  }

  @Patch(':id')
  async update(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingCustomerDto: UpdateBookingCustomerDto,
  ) {
    const bookingCustomer = await this.bookingCustomerService.update(
      bookingId,
      id,
      updateBookingCustomerDto,
    );

    return new UpdateBookingCustomerSuccessResponse(bookingCustomer);
  }
}
