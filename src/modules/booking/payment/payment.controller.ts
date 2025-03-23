import { Controller } from '@nestjs/common';
import { BookingPaymentService } from './payment.service';

@Controller('payment')
export class BookingPaymentController {
  constructor(private readonly bookingPaymentService: BookingPaymentService) {}
}
