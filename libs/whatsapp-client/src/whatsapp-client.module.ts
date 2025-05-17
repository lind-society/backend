import { QUEUE, SERVICE } from '@libs/common/constants';
import { RabbitMqModule } from '@libs/rabbitmq';
import { Module } from '@nestjs/common';
import { WhatsappClientService } from './whatsapp-client.service';

@Module({
  imports: [RabbitMqModule.register(SERVICE.WHATSAPP, QUEUE.WHATSAPP)],
  providers: [WhatsappClientService],
  exports: [WhatsappClientService],
})
export class WhatsappClientModule {}
