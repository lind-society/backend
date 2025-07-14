// xendit.strategy.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, {
  AxiosBasicCredentials,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import {
  CreateInvoiceRequestDto,
  CreateInvoiceResponseDto,
  InvoiceCallbackDto,
} from '../../dto';
import { CreatePaymentSessionRequestDto } from '../../dto/card-payment/create-payment-session-request.dto';
import { CreatePaymentSessionResponseDto } from '../../dto/card-payment/create-payment-session-response.dto';
import { IPaymentStrategy } from '../../interfaces';
import { XenditCreatePaymentSessionResponseDto } from './dto/card-payment/xendit-create-payment-session-response.dto';

import { XenditCreateInvoiceResponseDto } from './dto/invoice';
import { mapGenericToXenditCreateInvoiceRequestDto } from './helper';
import { mapXenditToGenericCreateInvoiceResponseDto } from './helper/dto-mapper/invoice';
import {
  mapGenericToCreateXenditCreatePaymentSessionRequest,
  mapXenditToGenericCreateXenditCreatePaymentSessionResponse,
} from './helper/dto-mapper/xendit-card-payment-dto-mapper.dto';

@Injectable()
export class XenditStrategy implements IPaymentStrategy {
  private xenditBaseUrl: string;
  private xenditAuth: AxiosBasicCredentials;
  private axiosConfig: AxiosRequestConfig;

  constructor(private configService: ConfigService) {
    this.xenditBaseUrl = this.configService.get<string>(
      'payment.gateway.provider.baseUrl',
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
        'api-version': '2024-11-11',
        'Content-Type': 'application/json',
      },
    };
  }

  // Invoice
  async createInvoice(
    payload: CreateInvoiceRequestDto,
  ): Promise<CreateInvoiceResponseDto> {
    const xenditPayload = mapGenericToXenditCreateInvoiceRequestDto(payload);
    const response: AxiosResponse<XenditCreateInvoiceResponseDto> =
      await axios.post(
        `${this.xenditBaseUrl}/v2/invoices`,
        xenditPayload,
        this.axiosConfig,
      );

    return mapXenditToGenericCreateInvoiceResponseDto(response.data);
  }

  // Payment Request
  async createPaymentRequest(payload: any): Promise<any> {
    const response: AxiosResponse<any> = await axios.post(
      `${this.xenditBaseUrl}/v3/payment_requests`,
      payload,
      this.axiosConfig,
    );

    return response.data;
  }

  // Card Payment
  async createPaymentSession(
    payload: CreatePaymentSessionRequestDto,
  ): Promise<CreatePaymentSessionResponseDto> {
    const xenditPayload =
      mapGenericToCreateXenditCreatePaymentSessionRequest(payload);

    console.log('transformed request :', xenditPayload);
    const response: AxiosResponse<XenditCreatePaymentSessionResponseDto> =
      await axios.post(
        `${this.xenditBaseUrl}/sessions`,
        xenditPayload,
        this.axiosConfig,
      );

    console.log('original response :', response);

    return mapXenditToGenericCreateXenditCreatePaymentSessionResponse(
      response.data,
    );
  }

  // Invoice related methods
  async receiveInvoiceCallback(
    payload: InvoiceCallbackDto,
  ): Promise<InvoiceCallbackDto> {
    console.log(payload);

    return payload;
  }
}
