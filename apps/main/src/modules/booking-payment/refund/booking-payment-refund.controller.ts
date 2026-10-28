import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards';
import { BookingAccessGuard } from '../../booking/guards';
import { BookingPaymentRefundService } from './booking-payment-refund.service';
import {
  GetBookingPaymentRefundSuccessResponse,
  UpdateBookingPaymentRefundDto,
  UpdateBookingPaymentRefundSuccessResponse,
} from './dto';

/**
 * Refund records for one booking. The guest may read their own refund status
 * through their booking link; changing a refund stays with the admin.
 */
@UseGuards(BookingAccessGuard)
@Controller('bookings/:bookingId/payment/:bookingPaymentId')
export class BookingPaymentRefundController {
  constructor(
    private readonly bookingPaymentRefundService: BookingPaymentRefundService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
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
