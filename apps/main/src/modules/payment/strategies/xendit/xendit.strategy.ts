// xendit.strategy.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, {
  AxiosBasicCredentials,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import {
  CreatePaymentInvoiceDto,
  CreatePaymentRequestDto,
  CreateSimulatePaymentDto,
  PaymentInvoiceDto,
  PaymentRequestDto,
  SimulatePaymentDto,
} from '../../dto';
import { CreatePaymentSessionDto } from '../../dto/card-payment/create-payment-session-request.dto';
import { PaymentSessionDto } from '../../dto/card-payment/payment-session.dto';
import { IPaymentStrategy } from '../../interfaces';
import { XenditPaymentSessionDto } from './dto/card-payment/xendit-payment-session.dto';

import { PAYMENT_REQUEST_CALLBACK } from '@apps/main/common/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { XenditInvoiceCallbackDto } from './dto';
import { XenditPaymentInvoiceDto } from './dto/invoice';
import {
  XenditPaymentRequestCallbackDto,
  XenditPaymentRequestDto,
  XenditSimulatePaymentDto,
} from './dto/payment-request';
import { mapGenericToXenditCreatePaymentInvoiceDto } from './helper';
import {
  mapGenericToXenditCreatePaymentSessionDto,
  mapXenditToGenericCreatePaymentSessionResponse,
} from './helper/dto-mapper/card-payment/xendit-card-payment-dto-mapper.dto';
import { mapXenditToGenericPaymentInvoiceDto } from './helper/dto-mapper/invoice';
import { mapXenditToGenericPaymentRequestCallbackDto } from './helper/dto-mapper/payment-request';
import { mapGenericToXenditCreatePaymentRequestDto } from './helper/dto-mapper/payment-request/xendit-create-payment-request-dto-mapper.helper';
import { mapXenditToGenericPaymentRequestDto } from './helper/dto-mapper/payment-request/xendit-create-payment-response-dto-mapper.helper';
import {
  mapGenericToXenditCreateSimulatePaymentDto,
  mapXenditToGenericSimulatePaymentDto,
} from './helper/dto-mapper/payment-request/xendit-simulate-payment-dto-mapper.helper';

@Injectable()
export class XenditStrategy implements IPaymentStrategy {
  private xenditBaseUrl: string;
  private xenditApiVersion: string;
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

  // Invoice
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

  // Payment Request
  async createPaymentRequest(
    payload: CreatePaymentRequestDto,
  ): Promise<PaymentRequestDto> {
    const xenditPayload = mapGenericToXenditCreatePaymentRequestDto(payload);
    console.log('xenditPayload :', xenditPayload)
    const response: AxiosResponse<XenditPaymentRequestDto> = await axios.post(
      `${this.xenditBaseUrl}/v3/payment_requests`,
      xenditPayload,
      this.axiosConfig,
    );

    return mapXenditToGenericPaymentRequestDto(response.data);
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

    return mapXenditToGenericPaymentRequestDto(response.data);
  }

  // Card Payment
  async createPaymentSession(
    payload: CreatePaymentSessionDto,
  ): Promise<PaymentSessionDto> {
    const xenditPayload = mapGenericToXenditCreatePaymentSessionDto(payload);
    const response: AxiosResponse<XenditPaymentSessionDto> = await axios.post(
      `${this.xenditBaseUrl}/sessions`,
      xenditPayload,
      this.axiosConfig,
    );

    return mapXenditToGenericCreatePaymentSessionResponse(response.data);
  }

  // callbacks
  async receiveInvoiceCallback(
    payload: XenditInvoiceCallbackDto,
  ): Promise<void> {}

  async receivePaymentRequestCallback(
    payload: XenditPaymentRequestCallbackDto,
  ): Promise<void> {
    const paymentRequestCallback =
      mapXenditToGenericPaymentRequestCallbackDto(payload);

    await this.eventEmitter.emitAsync(
      PAYMENT_REQUEST_CALLBACK,
      paymentRequestCallback,
    );
  }

  // simulations
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
}
