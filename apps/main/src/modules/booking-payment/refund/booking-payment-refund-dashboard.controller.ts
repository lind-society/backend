import { HalEmbedded } from '@apps/main/common/decorators';
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
import { JwtAuthGuard } from '../../auth/guards';
import { DeleteResponse } from '../../shared/dto/custom-responses';
import { BookingPaymentRefundService } from './booking-payment-refund.service';
import {
  CreateBookingPaymentRefundDto,
  CreateBookingPaymentRefundSuccessResponse,
  GetBookingPaymentRefundsSuccessResponse,
  GetBookingPaymentRefundSuccessResponse,
  UpdateBookingPaymentRefundDto,
  UpdateBookingPaymentRefundSuccessResponse,
} from './dto';

@UseGuards(JwtAuthGuard)
@HalEmbedded(
  { name: 'activityBookings', path: 'bookings/activities' },
  { name: 'villaBookings', path: 'bookings/villas' },
)
@Controller('booking-payment refunds')
export class BookingPaymentRefundDashboardController {
  constructor(
    private bookingPaymentRefundService: BookingPaymentRefundService,
  ) {}

  @Post()
  async create(@Body() payload: CreateBookingPaymentRefundDto) {
    const bookingPaymentRefund = await this.bookingPaymentRefundService.create(
      payload,
      true,
    );

    return new CreateBookingPaymentRefundSuccessResponse(bookingPaymentRefund);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const bookingPaymentRefunds =
      await this.bookingPaymentRefundService.findAll(query);

    return new GetBookingPaymentRefundsSuccessResponse(bookingPaymentRefunds);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const bookingPaymentRefund = await this.bookingPaymentRefundService.findOne(
      id,
      true,
      true,
    );

    return new GetBookingPaymentRefundSuccessResponse(bookingPaymentRefund);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingPaymentRefundDto: UpdateBookingPaymentRefundDto,
  ) {
    const bookingPaymentRefund = await this.bookingPaymentRefundService.update(
      id,
      updateBookingPaymentRefundDto,
      true,
    );

    return new UpdateBookingPaymentRefundSuccessResponse(bookingPaymentRefund);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.bookingPaymentRefundService.remove(id, true);

    return new DeleteResponse('delete booking payment refund success');
  }
}
