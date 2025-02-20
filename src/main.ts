import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston-logger.config';
import { ConfigService } from '@nestjs/config';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { WinstonLoggerService } from './modules/shared/logger/logger.service';
import { HttpExceptionFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  const logger = app.get<WinstonLoggerService>(WinstonLoggerService);
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost);

  const port = configService.get('app.port');
  const apiVersion = configService.get('app.apiVersion');
  const host = configService.get('app.host');
  const env = configService.get('app.env');

  app.setGlobalPrefix(`api/${apiVersion}`);

  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory(errors) {
        return new UnprocessableEntityException(errors);
      },
    }),
  );

  await app.listen(port, () => {
    logger.log(`env : ${env}`);

    env === 'development'
      ? logger.log(`app running on : http://${host}:${port}`)
      : logger.log(`app running on : ${host}:${port}`);
  });
}
bootstrap();
