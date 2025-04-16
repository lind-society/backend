import { RabbitMqService } from '@libs/rabbitmq/rabbitmq.service';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { WhatsappModule } from './whatsapp.module';

async function bootstrap() {
  const app = await NestFactory.create(WhatsappModule);

  const rabbitMqService = app.get<RabbitMqService>(RabbitMqService);

  const microserviceApp =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      WhatsappModule,
      rabbitMqService.getOptions('whatsapp'),
    );

  await microserviceApp.listen();

  console.log('WhatsApp Microservice is running...');
}
bootstrap();
