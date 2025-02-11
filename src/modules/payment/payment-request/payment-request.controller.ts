import { Controller } from '@nestjs/common';
import { PaymentRequestService } from './payment-request.service';

@Controller('payment-request')
export class PaymentRequestController {
  constructor(private readonly paymentRequestService: PaymentRequestService) {}
}
