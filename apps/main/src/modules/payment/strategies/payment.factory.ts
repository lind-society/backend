import { PaymentGatewayProvider } from '@apps/main/common/enums';
import { Injectable } from '@nestjs/common';
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
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }
}

// export const PaymentGatewayFactory: Provider = {
//   provide: MainProvider.PaymentGateway,
//   useFactory: (
//     configService: ConfigService,
//     xenditStrategy: XenditStrategy,
//   ) => {
//     const paymentGatewayProvider = configService.get<string>(
//       'payment.gateway.provider.name',
//     );

//     switch (paymentGatewayProvider) {
//       case PaymentGatewayProvider.Xendit:
//         return xenditStrategy;
//       default:
//         throw new InternalServerErrorException(
//           'Invalid Payment Gateway Provider',
//         );
//     }
//   },
//   inject: [XenditStrategy],
// };
