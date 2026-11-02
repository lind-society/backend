import { PaymentGatewayProvider } from '@apps/main/common/enums';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IPaymentStrategy } from '../interfaces';
import { XenditStrategy } from './xendit/xendit.strategy';

@Injectable()
export class PaymentStrategyFactory {
  constructor(private xenditStrategy: XenditStrategy) {}

  createStrategy(provider: PaymentGatewayProvider.Xendit): IPaymentStrategy;

  createStrategy(provider: PaymentGatewayProvider): IPaymentStrategy {
    switch (provider) {
      case PaymentGatewayProvider.Xendit:
        return this.xenditStrategy;
      default:
        throw new InternalServerErrorException(
          `unsupported payment provider: ${provider}`,
        );
    }
  }
}

