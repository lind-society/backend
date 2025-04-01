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
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PriceConverterInterceptor } from 'src/common/interceptors';
import { DeleteResponse } from 'src/modules/shared/dto/custom-responses';
import { BookingPaymentService } from './booking-payment.service';
import {
  CreateBookingPaymentDto,
  CreateBookingPaymentSuccessResponse,
  GetBookingPaymentsSuccessResponse,
  GetBookingPaymentSuccessResponse,
  UpdateBookingPaymentDto,
  UpdateBookingPaymentSuccessResponse,
} from './dto';

@UseInterceptors(PriceConverterInterceptor)
@Controller('booking-payments')
export class BookingPaymentController {
  constructor(private readonly bookingPaymentService: BookingPaymentService) {}

  @Post()
  async create(@Body() payload: CreateBookingPaymentDto) {
    const bookingPayment = await this.bookingPaymentService.create(payload);

    return new CreateBookingPaymentSuccessResponse(bookingPayment);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const bookingPayments = await this.bookingPaymentService.findAll(query);

    return new GetBookingPaymentsSuccessResponse(bookingPayments);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const bookingPayment = await this.bookingPaymentService.findOne(id);

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
    );

    return new UpdateBookingPaymentSuccessResponse(bookingPayment);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.bookingPaymentService.remove(id);

    return new DeleteResponse('delete booking payment success');
  }
}
