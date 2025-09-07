import { HalEmbedded, SkipHal } from '@apps/main/common/decorators';
import { PriceConverterInterceptor } from '@apps/main/common/interceptors';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  CancelPaymentRequestSuccessResponse,
  CancelPaymentSessionSuccessResponse,
  CreatePaymentRequestDto,
  CreatePaymentRequestSuccessResponse,
  CreatePaymentSessionDto,
  CreatePaymentSessionSuccessResponse,
} from '../payment/dto';
import { CreatePaymentRefundDto } from '../payment/dto/refund';
import { BookingPaymentService } from './booking-payment.service';
import {
  CreateBookingPaymentDto,
  CreateBookingPaymentSuccessResponse,
  GetBookingPaymentsSuccessResponse,
  GetBookingPaymentSuccessResponse,
} from './dto';

@UseInterceptors(PriceConverterInterceptor)
@HalEmbedded(
  { name: 'customer', path: 'booking-customers' },
  { name: 'activityBooking', path: 'bookings/activities' },
  { name: 'villaBooking', path: 'bookings/villas' },
)
@Controller('bookings/:bookingId/payments')
export class BookingPaymentController {
  constructor(private readonly bookingPaymentService: BookingPaymentService) {}
  @Post()
  async create(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() payload: CreateBookingPaymentDto,
  ) {
    const bookingPayment = await this.bookingPaymentService.create(
      bookingId,
      payload,
    );

    return new CreateBookingPaymentSuccessResponse(bookingPayment);
  }

  @Get()
  async findByBookingID(@Param('bookingId', ParseUUIDPipe) bookingId: string) {
    const bookingPayment =
      await this.bookingPaymentService.findByBookingId(bookingId);

    return new GetBookingPaymentsSuccessResponse(bookingPayment);
  }

  @Get(':id')
  async findOne(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const bookingPayment = await this.bookingPaymentService.findOne(
      bookingId,
      id,
    );

    return new GetBookingPaymentSuccessResponse(bookingPayment);
  }

  @Post(':id/pay/request')
  async pay(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: CreatePaymentRequestDto,
  ) {
    const result = await this.bookingPaymentService.createPaymentRequest(
      bookingId,
      id,
      payload,
    );

    return new CreatePaymentRequestSuccessResponse(result);
  }

  @Post(':id/pay/request/cancel')
  async cancelPaymentRequest(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const result = await this.bookingPaymentService.cancelPaymentRequest(
      bookingId,
      id,
    );

    return new CancelPaymentRequestSuccessResponse(result);
  }

  // Payment session currently used as card payment
  @SkipHal()
  @Post(':id/pay/session')
  async createPaymentRequestCard(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: CreatePaymentSessionDto,
  ) {
    const result = await this.bookingPaymentService.createPaymentSession(
      bookingId,
      id,
      payload,
    );

    return new CreatePaymentSessionSuccessResponse(result);
  }

  @Post(':id/pay/session/cancel')
  async cancelPaymentSession(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const result = await this.bookingPaymentService.cancelPaymentSession(
      bookingId,
      id,
    );

    return new CancelPaymentSessionSuccessResponse(result);
  }

  @Post(':id/pay/refund')
  async refund(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: CreatePaymentRefundDto,
  ) {
    const result = await this.bookingPaymentService.createPaymentRefund(
      bookingId,
      id,
      payload,
    );

    return result;
  }
}
