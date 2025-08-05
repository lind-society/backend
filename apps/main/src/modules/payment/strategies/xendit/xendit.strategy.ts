// xendit.strategy.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, {
  AxiosBasicCredentials,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import {
  CreatePaymentRequestDto,
  CreatePaymentTokenDto,
  CreateSimulatePaymentDto,
  PaymentDto,
  PaymentRequestDto,
  PaymentTokenDto,
  SimulatePaymentDto,
} from '../../dto';
import { CreatePaymentSessionDto } from '../../dto/payment-session/create-payment-session-request.dto';
import { PaymentSessionDto } from '../../dto/payment-session/payment-session.dto';
import { IPaymentStrategy } from '../../interfaces';

import {
  CANCEL_PAYMENT,
  CANCEL_PAYMENT_REQUEST,
  CANCEL_PAYMENT_SESSION,
  CANCEL_PAYMENT_TOKEN,
  CAPTURE_PAYMENT,
  CREATED_PAYMENT_REFUND,
  CREATED_PAYMENT_REQUEST,
  CREATED_PAYMENT_SESSION,
  CREATED_PAYMENT_TOKEN,
  PAYMENT_REFUND_CALLBACK,
  PAYMENT_REQUEST_CALLBACK,
  PAYMENT_SESSION_CALLBACK,
  PAYMENT_TOKEN_CALLBACK,
} from '@apps/main/common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatePaymentRefundDto, PaymentRefundDto } from '../../dto/refund';
import {
  XenditPaymentDto,
  XenditPaymentSessionCallbackDto,
  XenditPaymentSessionDto,
  XenditPaymentTokenCallbackDto,
  XenditPaymentTokenDto,
} from './dto';
import {
  XenditPaymentRequestCallbackDto,
  XenditPaymentRequestDto,
  XenditSimulatePaymentDto,
} from './dto/payment-request';
import {
  XenditPaymentRefundCallbackDto,
  XenditPaymentRefundDto,
} from './dto/refund';
import {
  mapGenericToXenditCreatePaymentRefundDto,
  mapXenditToGenericPaymentDto,
  mapXenditToGenericPaymentRefundCallbackDto,
  mapXenditToGenericPaymentRefundDto,
} from './helper';
import {
  mapGenericToXenditCreateSimulatePaymentDto,
  mapXenditToGenericPaymentRequestCallbackDto,
  mapXenditToGenericSimulatePaymentDto,
} from './helper/dto-mapper/payment-request';
import { mapGenericToXenditCreatePaymentRequestDto } from './helper/dto-mapper/payment-request/xendit-create-payment-request-dto-mapper.helper';
import { mapXenditToGenericPaymentRequestDto } from './helper/dto-mapper/payment-request/xendit-create-payment-response-dto-mapper.helper';
import { mapGenericToXenditCreatePaymentSessionDto } from './helper/dto-mapper/payment-session/xendit-create-payment-session-dto-mapper.dto';
import { mapXenditToGenericPaymentSessionCallbackDto } from './helper/dto-mapper/payment-session/xendit-payment-session-callback-dto.mapper';
import { mapXenditToGenericPaymentSessionDto } from './helper/dto-mapper/payment-session/xendit-payment-session-dto-mapper.dto';
import {
  mapGenericToXenditCreatePaymentTokenDto,
  mapXenditToGenericPaymentTokenDto,
} from './helper/dto-mapper/payment-token';
import { mapXenditToGenericPaymentTokenCallbackDto } from './helper/dto-mapper/payment-token/xendit-payment-token-callback-dto.mapper';

@Injectable()
export class XenditStrategy implements IPaymentStrategy {
  private xenditBaseUrl: string;
  private xenditApiVersion: string;
  private xenditWebhookVerificationToken: string; // to do validate webhook handler to match token
  private xenditAuth: AxiosBasicCredentials;
  private axiosConfig: AxiosRequestConfig;

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    this.xenditBaseUrl = this.configService.get<string>(
      'payment.gateway.provider.baseUrl',
    );

    this.xenditApiVersion = this.configService.get<string>(
      'payment.gateway.provider.xendit.apiVersion',
    );

    this.xenditWebhookVerificationToken = this.configService.get<string>(
      'payment.gateway.provider.xendit.webhookVerificationToken',
    );

    const xenditConfig = this.configService.get(
      'payment.gateway.provider.xendit.config',
    );

    this.xenditAuth = {
      username: xenditConfig.username,
      password: '',
    };

    this.axiosConfig = {
      auth: this.xenditAuth,
      headers: {
        'api-version': this.xenditApiVersion,
        'Content-Type': 'application/json',
      },
    };
  }

  // Payment Request
  async createPaymentRequest(
    payload: CreatePaymentRequestDto,
  ): Promise<PaymentRequestDto> {
    const xenditPayload = mapGenericToXenditCreatePaymentRequestDto(payload);

    const response: AxiosResponse<XenditPaymentRequestDto> = await axios.post(
      `${this.xenditBaseUrl}/v3/payment_requests`,
      xenditPayload,
      this.axiosConfig,
    );

    const result = mapXenditToGenericPaymentRequestDto(response.data);

    await this.eventEmitter.emitAsync(CREATED_PAYMENT_REQUEST, result);

    return result;
  }

  async getPaymentRequestDetail(
    paymentRequestId: string,
  ): Promise<PaymentRequestDto> {
    const response: AxiosResponse<XenditPaymentRequestDto> = await axios.get(
      `${this.xenditBaseUrl}/v3/payment_requests/${paymentRequestId}`,
      this.axiosConfig,
    );

    return mapXenditToGenericPaymentRequestDto(response.data);
  }

  async cancelPaymentRequest(
    paymentRequestId: string,
  ): Promise<PaymentRequestDto> {
    const response: AxiosResponse<XenditPaymentRequestDto> = await axios.post(
      `${this.xenditBaseUrl}/v3/payment_requests/${paymentRequestId}/cancel`,
      {}, // empty payload (request body)
      this.axiosConfig,
    );

    const genericResponse = mapXenditToGenericPaymentRequestDto(response.data);

    await this.eventEmitter.emitAsync(CANCEL_PAYMENT_REQUEST, genericResponse);

    return genericResponse;
  }

  async simulatePayment(paymentRequestId: string): Promise<SimulatePaymentDto> {
    const paymentDetail = await this.getPaymentRequestDetail(paymentRequestId);

    if (!paymentDetail.requestAmount) {
      throw new NotFoundException('payment request not found');
    }

    const payload: CreateSimulatePaymentDto = {
      amount: paymentDetail.requestAmount,
    };

    const xenditPayload = mapGenericToXenditCreateSimulatePaymentDto(payload);
    const response: AxiosResponse<XenditSimulatePaymentDto> = await axios.post(
      `${this.xenditBaseUrl}/v3/payment_requests/${paymentRequestId}/simulate`,
      xenditPayload,
      this.axiosConfig,
    );

    return mapXenditToGenericSimulatePaymentDto(response.data);
  }

  async receivePaymentRequestCallback(
    webhookVerificationToken: string,
    payload: XenditPaymentRequestCallbackDto,
  ): Promise<void> {
    this._validateWebhookVerificationToken(
      'payment request callback',
      webhookVerificationToken,
    );

    const paymentRequestCallback =
      mapXenditToGenericPaymentRequestCallbackDto(payload);

    await this.eventEmitter.emitAsync(
      PAYMENT_REQUEST_CALLBACK,
      paymentRequestCallback,
    );
  }

  // Payment Session
  async createPaymentSession(
    payload: CreatePaymentSessionDto,
  ): Promise<PaymentSessionDto> {
    const xenditPayload = mapGenericToXenditCreatePaymentSessionDto(payload);

    const response: AxiosResponse<XenditPaymentSessionDto> = await axios.post(
      `${this.xenditBaseUrl}/sessions`,
      xenditPayload,
      this.axiosConfig,
    );

    const genericResponse = mapXenditToGenericPaymentSessionDto(response.data);

    await this.eventEmitter.emitAsync(CREATED_PAYMENT_SESSION, genericResponse);

    return genericResponse;
  }

  async getPaymentSessionDetail(
    paymentSessionId: string,
  ): Promise<PaymentSessionDto> {
    const response: AxiosResponse<XenditPaymentSessionDto> = await axios.get(
      `${this.xenditBaseUrl}/sessions/${paymentSessionId}`,
      this.axiosConfig,
    );

    return mapXenditToGenericPaymentSessionDto(response.data);
  }

  async cancelPaymentSession(
    paymentSessionId: string,
  ): Promise<PaymentSessionDto> {
    const response: AxiosResponse<XenditPaymentSessionDto> = await axios.post(
      `${this.xenditBaseUrl}/sessions/${paymentSessionId}/cancel`,
      {},
      this.axiosConfig,
    );

    const genericResponse = mapXenditToGenericPaymentSessionDto(response.data);

    await this.eventEmitter.emitAsync(CANCEL_PAYMENT_SESSION, genericResponse);

    return genericResponse;
  }

  async receivePaymentSessionCallback(
    webhookVerificationToken: string,
    payload: XenditPaymentSessionCallbackDto,
  ): Promise<void> {
    this._validateWebhookVerificationToken(
      'payment session callback',
      webhookVerificationToken,
    );

    const paymentSessionCallback =
      mapXenditToGenericPaymentSessionCallbackDto(payload);

    await this.eventEmitter.emitAsync(
      PAYMENT_SESSION_CALLBACK,
      paymentSessionCallback,
    );
  }

  // Payment
  async getPaymentDetail(paymentId: string): Promise<PaymentDto> {
    const response: AxiosResponse<XenditPaymentDto> = await axios.get(
      `${this.xenditBaseUrl}/v3/payments/${paymentId}`,
      this.axiosConfig,
    );

    return mapXenditToGenericPaymentDto(response.data);
  }

  async cancelPayment(paymentId: string): Promise<PaymentDto> {
    const response: AxiosResponse<XenditPaymentDto> = await axios.post(
      `${this.xenditBaseUrl}/v3/payments/${paymentId}/cancel`,
      {},
      this.axiosConfig,
    );

    const genericResponse = mapXenditToGenericPaymentDto(response.data);

    await this.eventEmitter.emitAsync(CANCEL_PAYMENT, genericResponse);

    return genericResponse;
  }

  async capturePayment(paymentId: string): Promise<PaymentDto> {
    const response: AxiosResponse<XenditPaymentDto> = await axios.post(
      `${this.xenditBaseUrl}/v3/payments/${paymentId}/capture`,
      {},
      this.axiosConfig,
    );

    const genericResponse = mapXenditToGenericPaymentDto(response.data);

    await this.eventEmitter.emitAsync(CAPTURE_PAYMENT, genericResponse);

    return genericResponse;
  }

  // Refund
  async createPaymentRefund(
    payload: CreatePaymentRefundDto,
  ): Promise<PaymentRefundDto> {
    const xenditPayload = mapGenericToXenditCreatePaymentRefundDto(payload);

    const response: AxiosResponse<XenditPaymentRefundDto> = await axios.post(
      `${this.xenditBaseUrl}/refunds`,
      xenditPayload,
      this.axiosConfig,
    );

    const genericResponse = mapXenditToGenericPaymentRefundDto(response.data);

    await this.eventEmitter.emitAsync(CREATED_PAYMENT_REFUND, genericResponse);

    return genericResponse;
  }

  async receivePaymentRefundCallback(
    webhookVerificationToken: string,
    payload: XenditPaymentRefundCallbackDto,
  ): Promise<void> {
    this._validateWebhookVerificationToken(
      'payment refund callback',
      webhookVerificationToken,
    );

    const paymentRefundCallback =
      mapXenditToGenericPaymentRefundCallbackDto(payload);

    await this.eventEmitter.emitAsync(
      PAYMENT_REFUND_CALLBACK,
      paymentRefundCallback,
    );
  }

  // Payment Token
  async createPaymentToken(
    payload: CreatePaymentTokenDto,
  ): Promise<PaymentTokenDto> {
    const xenditPayload = mapGenericToXenditCreatePaymentTokenDto(payload);

    const response: AxiosResponse<XenditPaymentTokenDto> = await axios.post(
      `${this.xenditBaseUrl}/v3/payment_tokens`,
      xenditPayload,
      this.axiosConfig,
    );

    const genericResponse = mapXenditToGenericPaymentTokenDto(response.data);

    await this.eventEmitter.emitAsync(CREATED_PAYMENT_TOKEN, genericResponse);

    return genericResponse;
  }
  async getPaymentTokenDetail(
    paymentTokenId: string,
  ): Promise<PaymentTokenDto> {
    const response: AxiosResponse<XenditPaymentTokenDto> = await axios.get(
      `${this.xenditBaseUrl}/v3/payment_tokens/${paymentTokenId}`,
      this.axiosConfig,
    );

    return mapXenditToGenericPaymentTokenDto(response.data);
  }

  async cancelPaymentToken(paymentTokenId: string): Promise<PaymentTokenDto> {
    const response: AxiosResponse<XenditPaymentTokenDto> = await axios.post(
      `${this.xenditBaseUrl}/v3/payment_tokens/${paymentTokenId}`,
      {},
      this.axiosConfig,
    );

    const genericResponse = mapXenditToGenericPaymentTokenDto(response.data);

    await this.eventEmitter.emitAsync(CANCEL_PAYMENT_TOKEN, genericResponse);

    return genericResponse;
  }

  async receivePaymentTokenCallback(
    webhookVerificationToken: string,
    payload: XenditPaymentTokenCallbackDto,
  ): Promise<void> {
    this._validateWebhookVerificationToken(
      'payment token callback',
      webhookVerificationToken,
    );

    const paymentTokenCallback =
      mapXenditToGenericPaymentTokenCallbackDto(payload);

    await this.eventEmitter.emitAsync(
      PAYMENT_TOKEN_CALLBACK,
      paymentTokenCallback,
    );
  }

  _validateWebhookVerificationToken(
    action: string,
    callbackToken: string,
  ): void {
    if (callbackToken !== this.xenditWebhookVerificationToken) {
      throw new ForbiddenException(
        `${action} rejected, invalid callback token`,
      );
    }
  }
}

// deprecated
/* Invoice
  async createInvoice(
    payload: CreatePaymentInvoiceDto,
  ): Promise<PaymentInvoiceDto> {
    const xenditPayload = mapGenericToXenditCreatePaymentInvoiceDto(payload);
    const response: AxiosResponse<XenditPaymentInvoiceDto> = await axios.post(
      `${this.xenditBaseUrl}/v2/invoices`,
      xenditPayload,
      this.axiosConfig,
    );

    return mapXenditToGenericPaymentInvoiceDto(response.data);
  }

  async receiveInvoiceCallback(
    payload: XenditPaymentInvoiceCallbackDto,
  ): Promise<void> {
    const paymentInvoiceCallback =
      mapXenditToGenericInvoiceCallbackDto(payload);

    await this.eventEmitter.emitAsync(
      PAYMENT_REQUEST_CALLBACK,
      paymentInvoiceCallback,
    );
  }
    */
