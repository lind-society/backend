import { WhatsappClientModule } from '@libs/whatsapp-client';
import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';

@Module({
  imports: [WhatsappClientModule],
  controllers: [WhatsappController],
})
export class WhatsappAdminModule {}
