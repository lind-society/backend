import {
  ClassSerializerInterceptor,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { validationExceptionFactory } from './common/factories';
import { HttpExceptionFilter } from './common/filters';
import { winstonConfig } from './config/winston-logger.config';
import { WinstonLoggerService } from './modules/shared/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  const logger = app.get<WinstonLoggerService>(WinstonLoggerService);
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost);

  const port = configService.get<string>('app.port');
  const apiVersion = configService.get<string>('app.apiVersion');
  const host = configService.get<string>('app.host');
  const env = configService.get<string>('app.env');

  app.setGlobalPrefix(`api/${apiVersion}`);

  app.enableCors({
    origin: [
      configService.get<string>('frontend.development'),
      configService.get<string>('frontend.staging'),
      configService.get<string>('frontend.production'),
    ],
    credentials: true,
  });

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
        console.error(validationExceptionFactory(errors));

        return new UnprocessableEntityException(errors);
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(port, () => {
    logger.log(`env : ${env}`);

    env === 'development'
      ? logger.log(`app running on : http://${host}:${port}`)
      : logger.log(`app running on : ${host}:${port}`);
  });
}
bootstrap();
