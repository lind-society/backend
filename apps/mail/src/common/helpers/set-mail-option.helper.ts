import { MailerOptions } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export function setMailOption(configService: ConfigService): MailerOptions {
  return {
    transport: {
      host: configService.get<string>('mail.config.host'),
      secure: false,
      auth: {
        user: configService.get<string>('mail.config.user'),
        pass: configService.get<string>('mail.config.password'),
      },
    },
    defaults: {
      from: `${configService.get<string>('mail.sender.name')} <${configService.get<string>('mail.sender.email')}>`,
    },
    template: {
      dir: join(__dirname, '..', '..', '..', 'views'),
      adapter: new EjsAdapter(),
      options: {
        strict: false,
      },
    },
  };
}
