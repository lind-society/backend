import { Test } from '@nestjs/testing';
import { BookingOwnerReplyService } from './booking-owner-reply.service';
import { BookingWhatsappInboundController } from './booking-whatsapp-inbound.controller';

/**
 * Covers the seam between the RabbitMQ handler and the reply logic: that the
 * controller is wired to the service at all, and that it absorbs failures
 * instead of letting them bubble back into the queue consumer.
 */
describe('BookingWhatsappInboundController', () => {
  async function buildController(
    handleInboundMessage: jest.Mock,
  ): Promise<BookingWhatsappInboundController> {
    const moduleRef = await Test.createTestingModule({
      controllers: [BookingWhatsappInboundController],
      providers: [
        {
          provide: BookingOwnerReplyService,
          useValue: { handleInboundMessage },
        },
      ],
    }).compile();

    return moduleRef.get(BookingWhatsappInboundController);
  }

  it('hands the message straight to the reply service', async () => {
    const handleInboundMessage = jest
      .fn()
      .mockResolvedValue({ outcome: 'applied', bookingId: 'booking-1' });

    const controller = await buildController(handleInboundMessage);

    const payload = {
      phoneNumber: '6281234567890',
      message: 'AVAILABLE 3F2A1B9C',
      messageId: 'wa-1',
      receivedAt: '2026-07-31T02:00:00.000Z',
    };

    await controller.handleInboundMessage(payload);

    expect(handleInboundMessage).toHaveBeenCalledWith(payload);
  });

  it('swallows a failure so one bad message cannot stall the queue', async () => {
    const handleInboundMessage = jest
      .fn()
      .mockRejectedValue(new Error('database is down'));

    const controller = await buildController(handleInboundMessage);

    await expect(
      controller.handleInboundMessage({
        phoneNumber: '6281234567890',
        message: 'AVAILABLE',
      }),
    ).resolves.toBeUndefined();
  });

  it('survives a payload with nothing in it', async () => {
    const handleInboundMessage = jest.fn().mockResolvedValue({
      outcome: 'ignored',
    });

    const controller = await buildController(handleInboundMessage);

    await expect(
      controller.handleInboundMessage(undefined as never),
    ).resolves.toBeUndefined();
  });
});
