import { Controller } from '@nestjs/common';
import { BookingCustomerService } from './customer.service';

@Controller('customer')
export class BookingCustomerController {
  constructor(
    private readonly bookingCustomerService: BookingCustomerService,
  ) {}
}
