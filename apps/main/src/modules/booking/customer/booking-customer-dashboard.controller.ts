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
import { BookingCustomerService } from './booking-customer.service';
import {
  CreateBookingCustomerDto,
  CreateBookingCustomerSuccessResponse,
  GetBookingCustomersSuccessResponse,
  GetBookingCustomerSuccessResponse,
  UpdateBookingCustomerDto,
  UpdateBookingCustomerSuccessResponse,
} from './dto';

@UseGuards(JwtAuthGuard)
@HalEmbedded(
  { name: 'activityBookings', path: 'bookings/activities' },
  { name: 'villaBookings', path: 'bookings/villas' },
)
@Controller('booking-customers')
export class BookingCustomerDashboardController {
  constructor(private bookingCustomerService: BookingCustomerService) {}

  @Post()
  async create(@Body() payload: CreateBookingCustomerDto) {
    const bookingCustomer = await this.bookingCustomerService.create(
      payload,
      true,
    );

    return new CreateBookingCustomerSuccessResponse(bookingCustomer);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const bookingCustomers = await this.bookingCustomerService.findAll(query);

    return new GetBookingCustomersSuccessResponse(bookingCustomers);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const bookingCustomer = await this.bookingCustomerService.findOne(
      id,
      true,
      true,
    );

    return new GetBookingCustomerSuccessResponse(bookingCustomer);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingCustomerDto: UpdateBookingCustomerDto,
  ) {
    const bookingCustomer = await this.bookingCustomerService.update(
      id,
      updateBookingCustomerDto,
      true,
    );

    return new UpdateBookingCustomerSuccessResponse(bookingCustomer);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.bookingCustomerService.remove(id, true);

    return new DeleteResponse('delete booking customer success');
  }
}
