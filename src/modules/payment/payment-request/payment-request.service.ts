import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PaymentType } from 'src/common/enums/payment-type.enum';
import {
  AuthorizePaymentRequestRequest,
  CapturePaymentRequestRequest,
  CreatePaymentRequestRequest,
  GetAllPaymentRequestsRequest,
  GetPaymentRequestCapturesRequest,
  PaymentRequestApi,
} from 'xendit-node/payment_request/apis';
import {
  Capture,
  CaptureListResponse,
  PaymentRequest,
  PaymentRequestListResponse,
} from 'xendit-node/payment_request/models';

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

  private _sanitizePaymentRequestPayload(
    paymentRequest: CreatePaymentRequestRequest,
  ): CreatePaymentRequestRequest {
    const sanitizedPaymentRequestPayload = { ...paymentRequest };
    const paymentMethod = sanitizedPaymentRequestPayload.data.paymentMethod;

    console.log('payment method :', paymentMethod);
    switch (paymentMethod?.type) {
      case PaymentType.CARD:
        // if (paymentMethod.card.channelProperties.expiresAt) {
        //   paymentMethod.card.channelProperties.expiresAt = new Date(
        //     paymentMethod.card.channelProperties.expiresAt,
        //   );
        // }
        break;

      case PaymentType.DIRECT_DEBIT:
        break;

      case PaymentType.EWALLET:
        break;

      case PaymentType.OVER_THE_COUNTER:
        if (paymentMethod.overTheCounter.channelProperties.expiresAt) {
          paymentMethod.overTheCounter.channelProperties.expiresAt = new Date(
            paymentMethod.overTheCounter.channelProperties.expiresAt,
          );
        }

        break;

      case PaymentType.QR_CODE:
        if (paymentMethod.qrCode.channelProperties.expiresAt) {
          paymentMethod.qrCode.channelProperties.expiresAt = new Date(
            paymentMethod.qrCode.channelProperties.expiresAt,
          );
        }

        break;

      case PaymentType.VIRTUAL_ACCOUNT:
        if (paymentMethod.virtualAccount.channelProperties.expiresAt) {
          paymentMethod.virtualAccount.channelProperties.expiresAt = new Date(
            paymentMethod.virtualAccount.channelProperties.expiresAt,
          );
        }

        break;

      default:
        throw new BadRequestException('invalid payment type!');
    }

    return sanitizedPaymentRequestPayload;
  }

  async createPaymentRequest(
    paymentRequest: CreatePaymentRequestRequest,
  ): Promise<PaymentRequest> {
    console.log({ paymentRequest });
    const sanitizedPaymentRequestPayload =
      this._sanitizePaymentRequestPayload(paymentRequest);

    const response = await this.paymentRequestClient.createPaymentRequest({
      idempotencyKey:
        sanitizedPaymentRequestPayload.idempotencyKey || crypto.randomUUID(),
      data: paymentRequest.data,
    });

    console.log('response :', response);

    return response;
  }

  async getAllPaymentRequest(
    payload: GetAllPaymentRequestsRequest,
  ): Promise<PaymentRequestListResponse> {
    const paymentRequests =
      await this.paymentRequestClient.getAllPaymentRequests(payload);

    return paymentRequests;
  }

  async getPaymentRequestById(
    paymentRequestId: string,
  ): Promise<PaymentRequest> {
    const paymentRequest =
      await this.paymentRequestClient.getPaymentRequestByID({
        paymentRequestId,
      });

    return paymentRequest;
  }

  async getPaymentRequestCaptures(
    payload: GetPaymentRequestCapturesRequest,
  ): Promise<CaptureListResponse> {
    const paymentRequest =
      await this.paymentRequestClient.getPaymentRequestCaptures(payload);

    return paymentRequest;
  }

  async capturePaymentRequest(
    payload: CapturePaymentRequestRequest,
  ): Promise<Capture> {
    const paymentRequest =
      await this.paymentRequestClient.capturePaymentRequest(payload);

    return paymentRequest;
  }

  async authorizePaymentRequest(
    payload: AuthorizePaymentRequestRequest,
  ): Promise<PaymentRequest> {
    const paymentRequest =
      await this.paymentRequestClient.authorizePaymentRequest(payload);

    return paymentRequest;
  }

  async resendPaymentRequestAuth(
    paymentRequestId: string,
  ): Promise<PaymentRequest> {
    const paymentRequest =
      await this.paymentRequestClient.resendPaymentRequestAuth({
        paymentRequestId,
      });

    return paymentRequest;
  }
}
