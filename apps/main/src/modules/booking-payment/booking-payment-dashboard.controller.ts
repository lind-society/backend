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
  GetBookingPaymentsSuccessResponse,
  GetBookingPaymentSuccessResponse,
  UpdateBookingPaymentDto,
  UpdateBookingPaymentSuccessResponse,
} from './dto';

@UseGuards(JwtAuthGuard)
@Controller('booking-payments')
export class BookingPaymentDashboardController {
  constructor(private bookingPaymentService: BookingPaymentService) {}

  @Post()
  async create(@Body() payload: CreateBookingPaymentDto) {
    const bookingPayment = await this.bookingPaymentService.create(
      payload,
      true,
    );

    return new CreateBookingPaymentSuccessResponse(bookingPayment);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const bookingPayments = await this.bookingPaymentService.findAll(query);

    return new GetBookingPaymentsSuccessResponse(bookingPayments);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const bookingPayment = await this.bookingPaymentService.findOne(
      id,
      true,
      true,
    );

    return new GetBookingPaymentSuccessResponse(bookingPayment);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingPaymentDto: UpdateBookingPaymentDto,
  ) {
    const bookingPayment = await this.bookingPaymentService.update(
      id,
      updateBookingPaymentDto,
      true,
    );

    return new UpdateBookingPaymentSuccessResponse(bookingPayment);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.bookingPaymentService.remove(id, true);

    return new DeleteResponse('delete booking customer success');
  }
}
