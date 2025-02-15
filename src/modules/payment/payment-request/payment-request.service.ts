import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PaymentType } from 'src/common/enums/payment-type.enum';
import { PaymentMethod } from 'xendit-node';
import {
  CreatePaymentRequestRequest,
  PaymentRequestApi,
} from 'xendit-node/payment_request/apis';
import { PaymentRequest } from 'xendit-node/payment_request/models';

/* 
  This service is use for making a payment request, whether based on a new created payment method or refering to the created payment method (if want to use user payment prefernece)
  Documentations
    - https://developers.xendit.co/api-reference/payments-api/#create-payment-request
    - https://github.com/xendit/xendit-node/blob/master/docs/PaymentRequest.md
**/
@Injectable()
export class PaymentRequestService {
  constructor(
    @Inject('XENDIT_PAYMENT_REQUEST_CLIENT')
    private readonly paymentRequestClient: PaymentRequestApi,
  ) {}

  sanitizePaymentPayload(paymentRequest: CreatePaymentRequestRequest): void {
    const paymentMethod = paymentRequest.data.paymentMethod;
    switch (paymentMethod.type) {
      case PaymentType.CARD:
      case PaymentType.DIRECT_DEBIT:
      case PaymentType.EWALLET:
      case PaymentType.OVER_THE_COUNTER:
        paymentMethod.overTheCounter.channelProperties.expiresAt = new Date(
          paymentMethod.virtualAccount.channelProperties.expiresAt,
        );
      case PaymentType.QR_CODE:
        paymentMethod.qrCode.channelProperties.expiresAt = new Date(
          paymentMethod.virtualAccount.channelProperties.expiresAt,
        );
      case PaymentType.VIRTUAL_ACCOUNT:
        paymentMethod.virtualAccount.channelProperties.expiresAt = new Date(
          paymentMethod.virtualAccount.channelProperties.expiresAt,
        );

        break;
      default:
        throw new BadRequestException('invalid payment type!');
    }
  }

  async createPaymentRequest(paymentRequest: CreatePaymentRequestRequest) {
    this.sanitizePaymentPayload(paymentRequest);

    const response: PaymentRequest =
      await this.paymentRequestClient.createPaymentRequest(paymentRequest);

    return response;
  }
}
