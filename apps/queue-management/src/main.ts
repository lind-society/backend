import { NestFactory } from '@nestjs/core';
import { QueueManagementModule } from './queue-management.module';

async function bootstrap() {
  const app = await NestFactory.create(QueueManagementModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
