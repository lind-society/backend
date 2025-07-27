import { HalEmbedded, SkipHal } from '@apps/main/common/decorators';
import { PriceConverterInterceptor } from '@apps/main/common/interceptors';
import { DeleteResponse } from '@apps/main/modules/shared/dto/custom-responses';
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
import {
  CreatePaymentInvoiceSuccessResponse,
  CreatePaymentRequestDto,
} from '../payment/dto';
import { BookingPaymentService } from './booking-payment.service';
import {
  CreateBookingPaymentDto,
  CreateBookingPaymentSuccessResponse,
  GetBookingPaymentSuccessResponse,
  UpdateBookingPaymentDto,
  UpdateBookingPaymentSuccessResponse,
} from './dto';

@UseInterceptors(PriceConverterInterceptor)
@HalEmbedded(
  { name: 'customer', path: 'booking-customers' },
  { name: 'activityBooking', path: 'bookings/activities' },
  { name: 'villaBooking', path: 'bookings/villas' },
)
@Controller()
export class BookingPaymentController {
  constructor(private readonly bookingPaymentService: BookingPaymentService) {}

  // Booking Payment (Entity) Dashboard Related Endpoints
  @Post('bookings/:bookingId/payments')
  async create(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() payload: CreateBookingPaymentDto,
  ) {
    const bookingPayment = await this.bookingPaymentService.create(
      payload,
      false,
      bookingId,
    );

    return new CreateBookingPaymentSuccessResponse(bookingPayment);
  }

  @Get('bookings/:bookingId/payments/:id')
  async findOne(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const bookingPayment = await this.bookingPaymentService.findOne(
      id,
      true,
      false,
      bookingId,
    );

    return new GetBookingPaymentSuccessResponse(bookingPayment);
  }

  @Patch('bookings/:bookingId/payments/:id')
  async update(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateBookingPaymentDto,
  ) {
    const bookingPayment = await this.bookingPaymentService.update(
      id,
      payload,
      false,
      bookingId,
    );

    return new UpdateBookingPaymentSuccessResponse(bookingPayment);
  }

  @Delete('bookings/:bookingId/payments/:id')
  async remove(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.bookingPaymentService.remove(id, false, bookingId);

    return new DeleteResponse('delete booking payment success');
  }

  // Payment Gateway related methods
  @Post('bookings/:bookingId/payments/:id/pay/invoice')
  async payInvoice(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() payload: any,
  ) {
    const result = await this.bookingPaymentService.createInvoice(
      bookingId,
      payload,
    );

    return new CreatePaymentInvoiceSuccessResponse(result);
  }

  @SkipHal()
  @Post('bookings/:bookingId/payments/:id/pay/card')
  async createPaymentRequest(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: CreatePaymentRequestDto,
  ) {
    const result = await this.bookingPaymentService.createPaymentRequest(
      bookingId,
      id,
      payload,
    );

    return result;
  }

  @Post('bookings/:bookingId/payments/:id/pay')
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

    return result;
  }
}
