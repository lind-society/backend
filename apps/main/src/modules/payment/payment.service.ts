import { UPDATED_BOOKING_PAYMENT } from '@apps/main/common/constants';
import { PaymentGatewayProvider } from '@apps/main/common/enums';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CreateInvoiceRequestDto,
  CreateInvoiceResponseDto,
  InvoiceCallbackDto,
} from './dto';
import { CreatePaymentSessionRequestDto } from './dto/card-payment/create-payment-session-request.dto';
import { CreatePaymentSessionResponseDto } from './dto/card-payment/create-payment-session-response.dto';
import { IPaymentStrategy } from './interfaces';
import { PaymentStrategyFactory } from './strategies';

@Injectable()
export class PaymentService {
  private paymentStrategy: IPaymentStrategy;

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
    private paymentStrategyFactory: PaymentStrategyFactory,
  ) {
    const currentProvider = this.configService.get<string>(
      'payment.gateway.provider.name',
    ) as PaymentGatewayProvider;

    this.paymentStrategy =
      this.paymentStrategyFactory.createStrategy(currentProvider);
  }

  async createInvoice(
    payload: CreateInvoiceRequestDto,
  ): Promise<CreateInvoiceResponseDto> {
    return await this.paymentStrategy.createInvoice(payload);
  }

  async createPaymentRequest(payload: any): Promise<any> {
    return await this.paymentStrategy.createPaymentRequest(payload);
  }

  // validate booking id from param passed by controller
  async createPaymentSession(
    payload: CreatePaymentSessionRequestDto,
  ): Promise<CreatePaymentSessionResponseDto> {
    return await this.paymentStrategy.createPaymentSession(payload);
  }

  // callback related methods
  async receiveInvoiceCallback(payload: InvoiceCallbackDto): Promise<any> {
    this.eventEmitter.emit(UPDATED_BOOKING_PAYMENT, payload);

    return await this.paymentStrategy.receiveInvoiceCallback(payload);
  }

  // helper methods
  switchProvider(provider: PaymentGatewayProvider): void {
    this.paymentStrategy = this.paymentStrategyFactory.createStrategy(provider);
  }

  async createInvoiceWithProvider(
    provider: PaymentGatewayProvider,
    payload: CreateInvoiceRequestDto,
  ): Promise<CreateInvoiceResponseDto> {
    const strategy = this.paymentStrategyFactory.createStrategy(provider);
    return await strategy.createInvoice(payload);
  }

  async invoiceCallback(payload: any) {
    console.log(payload);
  }
}
