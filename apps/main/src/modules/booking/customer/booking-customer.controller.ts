import { HalEmbedded } from '@apps/main/common/decorators';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { BookingAccessGuard } from '../guards';
import { BookingCustomerService } from './booking-customer.service';
import {
  GetBookingCustomersSuccessResponse,
  GetBookingCustomerSuccessResponse,
  UpdateBookingCustomerDto,
  UpdateBookingCustomerSuccessResponse,
} from './dto';

/**
 * Guest contact details for one booking. Readable and editable either by an
 * admin or by the guest holding that booking's link — never by the public: the
 * previous `@Public()` here handed out a name, email and phone number to anyone
 * who could guess a booking id.
 */
@UseGuards(BookingAccessGuard)
@HalEmbedded(
  { name: 'activityBookings', path: 'bookings/activities' },
  { name: 'villaBookings', path: 'bookings/villas' },
)
@Controller('bookings/:bookingId/customer')
export class BookingCustomerController {
  constructor(
    private readonly bookingCustomerService: BookingCustomerService,
  ) {}

  @Get()
  async findByBookingId(@Param('bookingId', ParseUUIDPipe) bookingId: string) {
    const bookingCustomer =
      await this.bookingCustomerService.findByBookingId(bookingId);

    return new GetBookingCustomersSuccessResponse(bookingCustomer);
  }

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
