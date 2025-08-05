import { Public } from '@apps/main/common/decorators';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { BookingPaymentRefundService } from './booking-payment-refund.service';
import {
  GetBookingPaymentRefundSuccessResponse,
  UpdateBookingPaymentRefundDto,
  UpdateBookingPaymentRefundSuccessResponse,
} from './dto';

@Controller('bookings/:bookingId/payment/:bookingPaymentId')
export class BookingPaymentRefundController {
  constructor(
    private readonly bookingPaymentRefundService: BookingPaymentRefundService,
  ) {}

  @Public()
  @Get(':id')
  async findOne(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const bookingPaymentRefund = await this.bookingPaymentRefundService.findOne(
      id,
      true,
      false,
      bookingId,
    );

    return new GetBookingPaymentRefundSuccessResponse(bookingPaymentRefund);
  }

  @Patch(':id')
  async update(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingPaymentRefundDto: UpdateBookingPaymentRefundDto,
  ) {
    const bookingPaymentRefund = await this.bookingPaymentRefundService.update(
      id,
      updateBookingPaymentRefundDto,
      false,
      bookingId,
    );

    return new UpdateBookingPaymentRefundSuccessResponse(bookingPaymentRefund);
  }
}
