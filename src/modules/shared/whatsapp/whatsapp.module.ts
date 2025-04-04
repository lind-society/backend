import { Module } from '@nestjs/common';
import { MainWhatsappClientProvider } from './providers/clients';
import { WhatsappController } from './whatsapp.controller';
import { WhatsAppClientFactory } from './whatsapp.factory';
import { WhatsappService } from './whatsapp.service';

@Module({
  controllers: [WhatsappController],
  providers: [
    WhatsappService,
    WhatsAppClientFactory,
    MainWhatsappClientProvider,
  ],
  exports: [WhatsappService],
})
export class WhatsappModule {}
