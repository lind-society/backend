import { PaymentGatewayProvider } from '@apps/main/common/enums';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreatePaymentRequestDto,
  CreatePaymentTokenDto,
  CreateSimulatePaymentDto,
  PaymentDto,
  PaymentRequestDto,
  PaymentTokenDto,
  SimulatePaymentDto,
} from './dto';
import { CreatePaymentSessionDto } from './dto/payment-session/create-payment-session-request.dto';
import { PaymentSessionDto } from './dto/payment-session/payment-session.dto';
import { CreatePaymentRefundDto, PaymentRefundDto } from './dto/refund';
import { IPaymentStrategy } from './interfaces';
import { PaymentStrategyFactory } from './strategies';
import {
  XenditPaymentRequestCallbackDto,
  XenditPaymentSessionCallbackDto,
  XenditPaymentTokenCallbackDto,
} from './strategies/xendit/dto';
import { XenditPaymentRefundCallbackDto } from './strategies/xendit/dto/refund';

@Injectable()
export class PaymentService implements IPaymentStrategy {
  private readonly logger = new Logger(PaymentService.name);

  private paymentStrategy: IPaymentStrategy;

  constructor(
    private configService: ConfigService,
    private paymentStrategyFactory: PaymentStrategyFactory,
  ) {
    const currentProvider = this.configService.get<string>(
      'payment.gateway.provider.name',
    ) as PaymentGatewayProvider;

    this.paymentStrategy =
      this.paymentStrategyFactory.createStrategy(currentProvider);
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
    webhookVerificationToken: string,
    payload: XenditPaymentRequestCallbackDto,
  ): Promise<void> {
    this.logger.log('received payment request callback');
    this.logger.log('event name :', payload.event);

    await this.paymentStrategy.receivePaymentRequestCallback(
      webhookVerificationToken,
      payload,
    );
  }

  // Payment Refund
  async createPaymentRefund(
    payload: CreatePaymentRefundDto,
  ): Promise<PaymentRefundDto> {
    return await this.paymentStrategy.createPaymentRefund(payload);
  }

  async receivePaymentRefundCallback(
    webhookVerificationToken: string,
    payload: XenditPaymentRefundCallbackDto,
  ): Promise<void> {
    this.logger.log('received payment refund callback');
    this.logger.log('event name :', payload.event);

    await this.paymentStrategy.receivePaymentRefundCallback(
      webhookVerificationToken,
      payload,
    );
  }

  // Payment Session
  async createPaymentSession(
    payload: CreatePaymentSessionDto,
  ): Promise<PaymentSessionDto> {
    return await this.paymentStrategy.createPaymentSession(payload);
  }

  async getPaymentSessionDetail(
    paymentSessionId: string,
  ): Promise<PaymentSessionDto> {
    return await this.paymentStrategy.getPaymentSessionDetail(paymentSessionId);
  }

  async cancelPaymentSession(
    paymentSessionId: string,
  ): Promise<PaymentSessionDto> {
    return await this.paymentStrategy.cancelPaymentSession(paymentSessionId);
  }

  async receivePaymentSessionCallback(
    webhookVerificationToken: string,
    payload: XenditPaymentSessionCallbackDto,
  ): Promise<void> {
    this.logger.log('received payment session callback');
    this.logger.log('event name :', payload.event);

    await this.paymentStrategy.receivePaymentSessionCallback(
      webhookVerificationToken,
      payload,
    );
  }

  // Payment
  async getPaymentDetail(paymentId: string): Promise<PaymentDto> {
    return await this.paymentStrategy.getPaymentDetail(paymentId);
  }

  async cancelPayment(paymentId: string): Promise<PaymentDto> {
    return await this.paymentStrategy.cancelPayment(paymentId);
  }

  async capturePayment(paymentId: string): Promise<PaymentDto> {
    return await this.paymentStrategy.capturePayment(paymentId);
  }

  // Payment Token
  async createPaymentToken(
    payload: CreatePaymentTokenDto,
  ): Promise<PaymentTokenDto> {
    return await this.paymentStrategy.createPaymentToken(payload);
  }

  async getPaymentTokenDetail(
    paymentTokenId: string,
  ): Promise<PaymentTokenDto> {
    return await this.paymentStrategy.getPaymentTokenDetail(paymentTokenId);
  }

  async cancelPaymentToken(paymentTokenId: string): Promise<PaymentTokenDto> {
    return await this.paymentStrategy.cancelPaymentToken(paymentTokenId);
  }

  async receivePaymentTokenCallback(
    webhookVerificationToken: string,
    payload: XenditPaymentTokenCallbackDto,
  ): Promise<void> {
    this.logger.log('received payment token callback');
    this.logger.log('event name :', payload.event);

    await this.paymentStrategy.receivePaymentTokenCallback(
      webhookVerificationToken,
      payload,
    );
  }

  // Helper Methods
  switchProvider(provider: PaymentGatewayProvider): void {
    this.paymentStrategy = this.paymentStrategyFactory.createStrategy(provider);
  }

  // deprecated

  // async createInvoiceWithProvider(
  //   provider: PaymentGatewayProvider,
  //   payload: CreatePaymentInvoiceDto,
  // ): Promise<PaymentInvoiceDto> {
  //   const strategy = this.paymentStrategyFactory.createStrategy(provider);
  //   return await strategy.createInvoice(payload);
  // }

  /* Invoice
  async createInvoice(
    payload: CreatePaymentInvoiceDto,
  ): Promise<PaymentInvoiceDto> {
    return await this.paymentStrategy.createInvoice(payload);
  }

  async receiveInvoiceCallback(
    payload: XenditPaymentInvoiceCallbackDto,
  ): Promise<void> {
    await this.paymentStrategy.receiveInvoiceCallback(payload);
  }
  */
}
