import { WHATSAPP_INBOUND_QUEUE } from '@libs/common/constants';
import { Environment } from '@libs/common/enums';
import { validationExceptionFactory } from '@libs/common/factories';
import {
  getClientConfig,
  setupDeadLetterQueue,
  setupRetryQueue,
} from '@libs/rabbitmq/services';
import {
  ClassSerializerInterceptor,
  INestApplication,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters';

/**
 * Registers the RabbitMQ listener that receives WhatsApp replies from the
 * WhatsApp microservice. Registration only — no connection is opened yet.
 */
function registerWhatsappInbound(
  app: INestApplication,
  rabbitMqUrl: string | undefined,
  logger: Logger,
): boolean {
  if (!rabbitMqUrl) {
    logger.warn(
      'RABBITMQ_URL is not set, incoming WhatsApp replies will not be processed',
    );

    return false;
  }

  app.connectMicroservice<MicroserviceOptions>(
    getClientConfig(rabbitMqUrl, WHATSAPP_INBOUND_QUEUE),
  );

  return true;
}

/**
 * Opens the connection to RabbitMQ, in the background.
 *
 * Deliberately never awaited by `bootstrap`. The RabbitMQ transport retries a
 * refused connection forever, so awaiting it means the HTTP server never starts
 * when the broker is down — the whole API would be held hostage by a
 * notification channel. Started after `listen` and left to reconnect on its own,
 * a broker that appears later is simply picked up then.
 */
function startWhatsappInbound(app: INestApplication, logger: Logger): void {
  app
    .startAllMicroservices()
    .then(() =>
      logger.log(`listening for whatsapp replies on : ${WHATSAPP_INBOUND_QUEUE}`),
    )
    .catch((error) =>
      logger.error(
        `failed to listen for whatsapp replies on ${WHATSAPP_INBOUND_QUEUE}: ${error.message}`,
      ),
    );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Main - Bootstrap');
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost);
  const reflector = app.get(Reflector);

  const port = configService.get<string>('app.port');
  const apiVersion = configService.get<string>('app.apiVersion');
  const host = configService.get<string>('app.host');
  const env = configService.get<string>('app.env');

  app.setGlobalPrefix(`api/${apiVersion}`);

  // Blank entries are dropped: an empty string in this list matches nothing but
  // is easy to mistake for "allow all" when reading the config.
  app.enableCors({
    origin: [
      configService.get<string>('frontend.development'),
      configService.get<string>('frontend.staging'),
      configService.get<string>('frontend.production'),
      configService.get<string>('frontend.admin'),
    ].filter(Boolean),
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

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

  app.use(compression());

  const rabbitMqUrl = configService.get<string>('RABBITMQ_URL');
  const whatsappInboundRegistered = registerWhatsappInbound(
    app,
    rabbitMqUrl,
    logger,
  );

  if (whatsappInboundRegistered) {
    // Fire-and-forget: these only declare the dead-letter and retry queues, and
    // already swallow a missing broker themselves.
    void setupDeadLetterQueue(rabbitMqUrl, WHATSAPP_INBOUND_QUEUE);
    void setupRetryQueue(rabbitMqUrl, WHATSAPP_INBOUND_QUEUE);
  }

  await app.listen(port, () => {
    logger.log(`env : ${env}`);

    env === Environment.Development
      ? logger.log(`app running on : http://${host}:${port}`)
      : logger.log(`app running on : ${host}:${port}`);
  });

  if (whatsappInboundRegistered) {
    startWhatsappInbound(app, logger);
  }
}
bootstrap();
