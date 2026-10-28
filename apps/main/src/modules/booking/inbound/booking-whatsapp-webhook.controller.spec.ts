import { ConfigService } from '@nestjs/config';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { BookingOwnerReplyService } from './booking-owner-reply.service';
import { BookingWhatsappWebhookController } from './booking-whatsapp-webhook.controller';

const SECRET = 'a-shared-secret-of-some-length';

/**
 * The webhook can move a booking to the payment step, so most of what matters
 * here is that it refuses to do so for anyone who cannot prove they are the
 * WhatsApp gateway.
 */
describe('BookingWhatsappWebhookController', () => {
  // `token: null` stands for "not configured" — passing `undefined` would fall
  // back to the default parameter and quietly test the wrong thing.
  async function buildController({
    token = SECRET,
    handleInboundMessage = jest.fn().mockResolvedValue({ outcome: 'applied' }),
  }: {
    token?: string | null;
    handleInboundMessage?: jest.Mock;
  } = {}) {
    const moduleRef = await Test.createTestingModule({
      controllers: [BookingWhatsappWebhookController],
      providers: [
        {
          provide: BookingOwnerReplyService,
          useValue: { handleInboundMessage },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue(token) },
        },
      ],
    }).compile();

    return {
      controller: moduleRef.get(BookingWhatsappWebhookController),
      handleInboundMessage,
    };
  }

  const message = {
    phoneNumber: '6281234567890',
    message: 'AVAILABLE 3F2A1B9C',
  };

  it('passes an authenticated message to the reply service', async () => {
    const { controller, handleInboundMessage } = await buildController();

    const result = await controller.receiveInboundMessage(SECRET, message);

    expect(handleInboundMessage).toHaveBeenCalledWith(message);
    expect(result).toEqual({ outcome: 'applied' });
  });

  it('rejects a wrong token', async () => {
    const { controller, handleInboundMessage } = await buildController();

    await expect(
      controller.receiveInboundMessage('not-the-secret-but-same-length!', message),
    ).rejects.toThrow(ForbiddenException);

    expect(handleInboundMessage).not.toHaveBeenCalled();
  });

  it('rejects a missing token', async () => {
    const { controller, handleInboundMessage } = await buildController();

    await expect(
      controller.receiveInboundMessage(undefined as never, message),
    ).rejects.toThrow(ForbiddenException);

    expect(handleInboundMessage).not.toHaveBeenCalled();
  });

  it('rejects a token of a different length without leaking that fact', async () => {
    const { controller } = await buildController();

    await expect(controller.receiveInboundMessage('short', message)).rejects.toThrow(
      ForbiddenException,
    );
  });

  // Fail closed: an unconfigured secret must not turn into an open endpoint.
  it('behaves as if the route does not exist when no secret is configured', async () => {
    const { controller, handleInboundMessage } = await buildController({
      token: null,
    });

    await expect(
      controller.receiveInboundMessage(SECRET, message),
    ).rejects.toThrow(NotFoundException);

    expect(handleInboundMessage).not.toHaveBeenCalled();
  });

  it('does not accept an empty configured secret either', async () => {
    const { controller } = await buildController({ token: '' });

    await expect(controller.receiveInboundMessage('', message)).rejects.toThrow(
      NotFoundException,
    );
  });
});
