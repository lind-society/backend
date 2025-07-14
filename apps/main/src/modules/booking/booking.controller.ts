import { Public } from '@apps/main/common/decorators';
import { getFilterValue } from '@apps/main/common/helpers';
import { BookingType } from '@apps/main/database/entities';
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
import { GetMultipleBookingPaymentSuccessResponse } from '../booking-payment/dto';
import { CreateInvoiceResponseSuccessResponse } from '../payment/dto';
import { DeleteResponse } from '../shared/dto/custom-responses';
import { BookingService } from './booking.service';
import { GetBookingCustomerSuccessResponse } from './customer/dto';
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
    const bookingType = getFilterValue<BookingType>(query, 'type');
    const bookings = await this.bookingService.findAll(query);

    return new GetBookingsSuccessResponse(bookings, bookingType);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const booking = await this.bookingService.findOne(id);
    const bookingType = this.bookingService.determineBookingType(booking);

    return new GetBookingSuccessResponse(booking, bookingType);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    const booking = await this.bookingService.update(id, updateBookingDto);
    const bookingType = this.bookingService.determineBookingType(booking);

    return new UpdateBookingSuccessResponse(booking, bookingType);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const booking = await this.bookingService.remove(id);
    const bookingType = this.bookingService.determineBookingType(booking);

    return new DeleteResponse(`delete ${bookingType ?? ''} booking success`);
  }

  // Customer related endpoints
  @Public()
  @Get(':id/customer')
  async getCustomerDetail(@Param('id', ParseUUIDPipe) id: string) {
    const customer = await this.bookingService.getCustomerDetail(id);

    return new GetBookingCustomerSuccessResponse(customer);
  }

  // Payment related endpoints
  @Public()
  @Get(':id/payments')
  async getPaymentsDetail(@Param('id', ParseUUIDPipe) id: string) {
    const payments = await this.bookingService.getPaymentsDetail(id);

    return new GetMultipleBookingPaymentSuccessResponse(payments);
  }

  // Payment Gateway related endpoints
  @Public()
  @Post(':id/pay-invoice')
  async createPaymentInvoice(@Param('id', ParseUUIDPipe) id: string) {
    const invoice = await this.bookingService.createPaymentInvoice(id);

    return new CreateInvoiceResponseSuccessResponse(invoice);
  }
}
