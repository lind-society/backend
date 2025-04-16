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
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { BookingCustomerService } from './booking-customer.service';
import {
  CreateBookingCustomerDto,
  CreateBookingCustomerSuccessResponse,
  GetBookingCustomersSuccessResponse,
  GetBookingCustomerSuccessResponse,
  UpdateBookingCustomerDto,
  UpdateBookingCustomerSuccessResponse,
} from './dto';

@Controller('booking-customers')
export class BookingCustomerController {
  constructor(
    private readonly bookingCustomerService: BookingCustomerService,
  ) {}

  @Post()
  async create(@Body() payload: CreateBookingCustomerDto) {
    const bookingCustomer = await this.bookingCustomerService.create(payload);

    return new CreateBookingCustomerSuccessResponse(bookingCustomer);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const bookingCustomers = await this.bookingCustomerService.findAll(query);

    return new GetBookingCustomersSuccessResponse(bookingCustomers);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const bookingCustomer = await this.bookingCustomerService.findOne(id);

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
    );

    return new UpdateBookingCustomerSuccessResponse(bookingCustomer);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.bookingCustomerService.remove(id);

    return new DeleteResponse('delete booking customer success');
  }
}
