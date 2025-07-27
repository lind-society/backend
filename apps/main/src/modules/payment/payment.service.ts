import { UPDATED_BOOKING_PAYMENT } from '@apps/main/common/constants';
import { PaymentGatewayProvider } from '@apps/main/common/enums';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CreatePaymentInvoiceDto,
  CreatePaymentRequestDto,
  CreateSimulatePaymentDto,
  PaymentInvoiceDto,
  PaymentRequestDto,
  SimulatePaymentDto,
} from './dto';
import { CreatePaymentSessionDto } from './dto/card-payment/create-payment-session-request.dto';
import { PaymentSessionDto } from './dto/card-payment/payment-session.dto';
import { IPaymentStrategy } from './interfaces';
import { PaymentStrategyFactory } from './strategies';
import {
  XenditInvoiceCallbackDto,
  XenditPaymentRequestCallbackDto,
} from './strategies/xendit/dto';

@Injectable()
export class PaymentService implements IPaymentStrategy {
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

  // Invoice
  async createInvoice(
    payload: CreatePaymentInvoiceDto,
  ): Promise<PaymentInvoiceDto> {
    return await this.paymentStrategy.createInvoice(payload);
  }

  async receiveInvoiceCallback(
    payload: XenditInvoiceCallbackDto,
  ): Promise<void> {
    this.eventEmitter.emit(UPDATED_BOOKING_PAYMENT, payload); // to do : set the event listener in booking payment service

    await this.paymentStrategy.receiveInvoiceCallback(payload);
  }

  // Payment Request
  async createPaymentRequest(
    payload: CreatePaymentRequestDto,
  ): Promise<PaymentRequestDto> {
    return await this.paymentStrategy.createPaymentRequest(payload);
  }

  async getPaymentRequestDetail(
    paymentRequestId: string,
  ): Promise<PaymentRequestDto> {
    return await this.paymentStrategy.getPaymentRequestDetail(paymentRequestId);
  }

  async cancelPaymentRequest(
    paymentRequestId: string,
  ): Promise<PaymentRequestDto> {
    return await this.paymentStrategy.cancelPaymentRequest(paymentRequestId);
  }

  async simulatePayment(
    paymentRequestId: string,
    payload?: CreateSimulatePaymentDto,
  ): Promise<SimulatePaymentDto> {
    return await this.paymentStrategy.simulatePayment(
      paymentRequestId,
      payload,
    );
  }

  async receivePaymentRequestCallback(
    payload: XenditPaymentRequestCallbackDto,
  ): Promise<void> {
    console.log('raw callback :', payload);
    await this.paymentStrategy.receivePaymentRequestCallback(payload);
  }

  // validate booking id from param passed by controller
  async createPaymentSession(
    payload: CreatePaymentSessionDto,
  ): Promise<PaymentSessionDto> {
    return await this.paymentStrategy.createPaymentSession(payload);
  }

  // helper methods
  switchProvider(provider: PaymentGatewayProvider): void {
    this.paymentStrategy = this.paymentStrategyFactory.createStrategy(provider);
  }

  async createInvoiceWithProvider(
    provider: PaymentGatewayProvider,
    payload: CreatePaymentInvoiceDto,
  ): Promise<PaymentInvoiceDto> {
    const strategy = this.paymentStrategyFactory.createStrategy(provider);
    return await strategy.createInvoice(payload);
  }
}
