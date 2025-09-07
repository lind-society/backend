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
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { JwtAuthGuard } from '../auth/guards';
import { DeleteResponse } from '../shared/dto/custom-responses';
import { BookingPaymentService } from './booking-payment.service';
import {
  CreateBookingPaymentDto,
  CreateBookingPaymentSuccessResponse,
  GetBookingPaymentDetailSuccessResponse,
  GetBookingPaymentRequestDetailSuccessResponse,
  GetBookingPaymentSessionDetailSuccessResponse,
  GetBookingPaymentsSuccessResponse,
  GetBookingPaymentSuccessResponse,
  GetBookingPaymentTokenDetailSuccessResponse,
  UpdateBookingPaymentDto,
  UpdateBookingPaymentSuccessResponse,
} from './dto';

@UseGuards(JwtAuthGuard)
@Controller('booking-payments')
export class BookingPaymentDashboardController {
  constructor(private bookingPaymentService: BookingPaymentService) {}

  @Post()
  async create(@Body() payload: CreateBookingPaymentDto) {
    const bookingPayment =
      await this.bookingPaymentService.createFromDashboard(payload);

    return new CreateBookingPaymentSuccessResponse(bookingPayment);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const bookingPayments = await this.bookingPaymentService.findAll(query);

    return new GetBookingPaymentsSuccessResponse(bookingPayments);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const bookingPayment =
      await this.bookingPaymentService.findOneFromDashboard(id);

    return new GetBookingPaymentSuccessResponse(bookingPayment);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingPaymentDto: UpdateBookingPaymentDto,
  ) {
    const bookingPayment = await this.bookingPaymentService.updateFromDashboard(
      id,
      updateBookingPaymentDto,
    );

    return new UpdateBookingPaymentSuccessResponse(bookingPayment);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.bookingPaymentService.removeFromDashboard(id);

    return new DeleteResponse('delete booking customer success');
  }

  // Payment Gateway Related Action
  @Get(':id/payment-request')
  async getPaymentRequestDetail(@Param('id', ParseUUIDPipe) id: string) {
    const bookingPaymentRequestDetail =
      await this.bookingPaymentService.getPaymentRequestDetail(id);

    return new GetBookingPaymentRequestDetailSuccessResponse(
      bookingPaymentRequestDetail,
    );
  }

  @Get(':id/payment-session')
  async getPaymentRefundDetail(@Param('id', ParseUUIDPipe) id: string) {
    const bookingPaymentSessionDetail =
      await this.bookingPaymentService.getPaymentSessionDetail(id);

    return new GetBookingPaymentSessionDetailSuccessResponse(
      bookingPaymentSessionDetail,
    );
  }

  @Get(':id/payment')
  async getPaymentDetail(@Param('id', ParseUUIDPipe) id: string) {
    const bookingPaymentDetail =
      await this.bookingPaymentService.getPaymentDetail(id);

    return new GetBookingPaymentDetailSuccessResponse(bookingPaymentDetail);
  }

  @Get(':id/payment-token')
  async getPaymentTokenDetail(@Param('id', ParseUUIDPipe) id: string) {
    const bookingPaymentTokenDetail =
      await this.bookingPaymentService.getPaymentTokenDetail(id);

    return new GetBookingPaymentTokenDetailSuccessResponse(
      bookingPaymentTokenDetail,
    );
  }
}
