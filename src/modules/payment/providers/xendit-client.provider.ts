import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Xendit } from 'xendit-node';

export const XenditClientProvider: Provider = {
  provide: 'XENDIT_CLIENT',
  useFactory: (configService: ConfigService) => {
    return new Xendit({
      secretKey: configService.get('xendit.secretKey'),
    });
  },
  inject: [ConfigService],
};
