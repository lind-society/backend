import { HalEmbedded, Public, SkipHal } from '@apps/main/common/decorators';
import { PriceConverterInterceptor } from '@apps/main/common/interceptors';
import { JwtAuthGuard } from '@apps/main/modules/auth/guards';
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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CreateInvoiceResponseSuccessResponse } from '../payment/dto';
import { BookingPaymentService } from './booking-payment.service';
import {
  CreateBookingPaymentDto,
  CreateBookingPaymentSuccessResponse,
  GetBookingPaymentsSuccessResponse,
  GetBookingPaymentSuccessResponse,
  UpdateBookingPaymentDto,
  UpdateBookingPaymentSuccessResponse,
} from './dto';

@UseGuards(JwtAuthGuard)
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
  @Post('booking-payments')
  async create(@Body() payload: CreateBookingPaymentDto) {
    const bookingPayment = await this.bookingPaymentService.create(payload);

    return new CreateBookingPaymentSuccessResponse(bookingPayment);
  }

  @Public()
  @Get('booking-payments')
  async findAll(@Paginate() query: PaginateQuery) {
    const bookingPayments = await this.bookingPaymentService.findAll(query);

    return new GetBookingPaymentsSuccessResponse(bookingPayments);
  }

  @Public()
  @Get('booking-payments/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const bookingPayment = await this.bookingPaymentService.findOne(id);

    return new GetBookingPaymentSuccessResponse(bookingPayment);
  }

  @Patch('booking-payments/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingPaymentDto: UpdateBookingPaymentDto,
  ) {
    const bookingPayment = await this.bookingPaymentService.update(
      id,
      updateBookingPaymentDto,
    );

    return new UpdateBookingPaymentSuccessResponse(bookingPayment);
  }

  @Delete('booking-payments/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.bookingPaymentService.remove(id);

    return new DeleteResponse('delete booking payment success');
  }

  // Booking and Payment related methods
  @Post('bookings/:bookingId/payment/create-payment-invoice')
  async createInvoice(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() payload: any,
  ) {
    const result = await this.bookingPaymentService.createInvoice(
      bookingId,
      payload,
    );

    return new CreateInvoiceResponseSuccessResponse(result);
  }

  @SkipHal()
  @Post('bookings/:bookingId/payment/create-payment-request')
  async createPaymentRequest(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() payload: any,
  ) {
    const result = await this.bookingPaymentService.createPaymentRequest(
      bookingId,
      payload,
    );

    return result;
  }
}
