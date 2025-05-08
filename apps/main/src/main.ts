import * as dotenv from 'dotenv';

dotenv.config();

import { Environment } from '@libs/common/enums';
import {
  ClassSerializerInterceptor,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { validationExceptionFactory } from './common/factories';
import { HttpExceptionFilter } from './common/filters';
import { SetHttpCodeInterceptor } from './common/interceptors';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Main - Bootstrap');
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
        logger.error(validationExceptionFactory(errors));

        return new UnprocessableEntityException(errors);
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new SetHttpCodeInterceptor());

  console.log(join(__dirname, '/**/*.entity.js'),);

  await app.listen(port, () => {
    logger.log(`env : ${env}`);

    env === Environment.Development
      ? logger.log(`app running on : http://${host}:${port}`)
      : logger.log(`app running on : ${host}:${port}`);
  });
}
bootstrap();
