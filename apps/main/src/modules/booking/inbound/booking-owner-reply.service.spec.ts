import {
  ActivityBookingStatus,
  BookingType,
  VillaBookingStatus,
} from '@apps/main/database/entities';
import { ConflictException } from '@nestjs/common';
import {
  BookingOwnerReplyService,
  OwnerReplyOutcome,
} from './booking-owner-reply.service';

const VILLA_BOOKING_ID = '3f2a1b9c-1234-4567-89ab-cdef01234567';
const OTHER_BOOKING_ID = 'aa11bb22-1234-4567-89ab-cdef01234567';
const ACTIVITY_BOOKING_ID = 'cc33dd44-1234-4567-89ab-cdef01234567';

const OWNER_PHONE = '6281234567890';

function villaBooking(id = VILLA_BOOKING_ID, overrides = {}) {
  return {
    id,
    type: BookingType.Villa,
    status: VillaBookingStatus.Requested,
    checkInDate: new Date('2026-08-01T00:00:00.000Z'),
    checkOutDate: new Date('2026-08-04T00:00:00.000Z'),
    totalGuest: 2,
    totalAmount: 3000000,
    currency: { symbol: 'Rp' },
    customer: { name: 'Rani', phoneCountryCode: '+62', phoneNumber: '81100' },
    villa: { name: 'Villa Sunset', owner: { name: 'Pak Budi' } },
    ...overrides,
  };
}

function activityBooking(overrides = {}) {
  return {
    id: ACTIVITY_BOOKING_ID,
    type: BookingType.Activity,
    status: ActivityBookingStatus.Pending,
    bookingDate: new Date('2026-08-01T00:00:00.000Z'),
    totalGuest: 2,
    totalAmount: 500000,
    currency: { symbol: 'Rp' },
    customer: { name: 'Rani', phoneCountryCode: '+62', phoneNumber: '81100' },
    activity: { name: 'Sunrise Trek', owner: { name: 'Pak Budi' } },
    ...overrides,
  };
}

/**
 * The repository is reduced to "what did the query return"; the query builder
 * itself is not under test here, the decision logic on top of it is.
 */
function buildService(candidates: any[]) {
  const queryBuilder = {
    leftJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(candidates.map(({ id }) => ({ id }))),
  };

  const bookingRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
  };

  const bookingService = {
    findOne: jest
      .fn()
      .mockImplementation(async (id: string) =>
        candidates.find((candidate) => candidate.id === id),
      ),
    update: jest.fn().mockResolvedValue(undefined),
  };

  const whatsappClientService = {
    sendMessage: jest.fn().mockResolvedValue(undefined),
  };

  const service = new BookingOwnerReplyService(
    bookingRepository as never,
    bookingService as never,
    whatsappClientService as never,
  );

  return { service, bookingService, whatsappClientService, queryBuilder };
}

function inbound(message: string, phoneNumber = OWNER_PHONE) {
  return { phoneNumber, message };
}

describe('BookingOwnerReplyService', () => {
  describe('messages that must not touch a booking', () => {
    it('ignores a message that carries no decision', async () => {
      const { service, bookingService } = buildService([villaBooking()]);

      const result = await service.handleInboundMessage(
        inbound('ok thanks, let me check'),
      );

      expect(result.outcome).toBe(OwnerReplyOutcome.Ignored);
      expect(bookingService.update).not.toHaveBeenCalled();
    });

    it('ignores a decision from a sender with no phone number', async () => {
      const { service, bookingService } = buildService([villaBooking()]);

      const result = await service.handleInboundMessage(
        inbound('AVAILABLE', ''),
      );

      expect(result.outcome).toBe(OwnerReplyOutcome.Ignored);
      expect(bookingService.update).not.toHaveBeenCalled();
    });

    it('survives a payload with no message at all', async () => {
      const { service } = buildService([villaBooking()]);

      const result = await service.handleInboundMessage({
        phoneNumber: OWNER_PHONE,
      } as never);

      expect(result.outcome).toBe(OwnerReplyOutcome.Ignored);
    });

    it('reports when the sender has nothing waiting on an answer', async () => {
      const { service, bookingService, whatsappClientService } =
        buildService([]);

      const result = await service.handleInboundMessage(inbound('AVAILABLE'));

      expect(result.outcome).toBe(OwnerReplyOutcome.NoPendingBooking);
      expect(bookingService.update).not.toHaveBeenCalled();
      // Silence is deliberate: the sender may not be an owner at all.
      expect(whatsappClientService.sendMessage).not.toHaveBeenCalled();
    });
  });

  describe('villa bookings', () => {
    it('moves an available villa to the payment step', async () => {
      const { service, bookingService, whatsappClientService } = buildService([
        villaBooking(),
      ]);

      const result = await service.handleInboundMessage(inbound('AVAILABLE'));

      expect(result).toMatchObject({
        outcome: OwnerReplyOutcome.Applied,
        bookingId: VILLA_BOOKING_ID,
        status: VillaBookingStatus.WaitingForPayment,
      });
      expect(bookingService.update).toHaveBeenCalledWith(VILLA_BOOKING_ID, {
        status: VillaBookingStatus.WaitingForPayment,
      });
      expect(whatsappClientService.sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({ phoneNumber: OWNER_PHONE }),
      );
    });

    it('sends an unavailable villa back to negotiation, not to cancellation', async () => {
      const { service, bookingService } = buildService([villaBooking()]);

      const result = await service.handleInboundMessage(
        inbound('NOT AVAILABLE'),
      );

      expect(result).toMatchObject({
        outcome: OwnerReplyOutcome.Applied,
        status: VillaBookingStatus.Negotiation,
      });
      expect(bookingService.update).toHaveBeenCalledWith(VILLA_BOOKING_ID, {
        status: VillaBookingStatus.Negotiation,
        closedReason: 'owner reported the dates as unavailable',
      });
    });

    it('tells the owner which answer was recorded', async () => {
      const { service, whatsappClientService } = buildService([villaBooking()]);

      await service.handleInboundMessage(inbound('AVAILABLE'));

      const [{ message }] = whatsappClientService.sendMessage.mock.calls[0];

      expect(message).toContain('3F2A1B9C');
      expect(message).toContain('AVAILABLE');
      expect(message).not.toContain('NOT AVAILABLE');
    });
  });

  describe('activity bookings', () => {
    it('acknowledges an available activity without moving it', async () => {
      const { service, bookingService, whatsappClientService } = buildService([
        activityBooking(),
      ]);

      const result = await service.handleInboundMessage(inbound('AVAILABLE'));

      // `pending` is already the payable state for an activity.
      expect(result).toMatchObject({
        outcome: OwnerReplyOutcome.Acknowledged,
        bookingId: ACTIVITY_BOOKING_ID,
        status: ActivityBookingStatus.Pending,
      });
      expect(bookingService.update).not.toHaveBeenCalled();
      expect(whatsappClientService.sendMessage).toHaveBeenCalled();
    });

    it('cancels an unavailable activity', async () => {
      const { service, bookingService } = buildService([activityBooking()]);

      const result = await service.handleInboundMessage(
        inbound('tidak tersedia'),
      );

      expect(result).toMatchObject({
        outcome: OwnerReplyOutcome.Applied,
        status: ActivityBookingStatus.Canceled,
      });
      expect(bookingService.update).toHaveBeenCalledWith(ACTIVITY_BOOKING_ID, {
        status: ActivityBookingStatus.Canceled,
        closedReason: 'owner reported the dates as unavailable',
      });
    });
  });

  describe('choosing between several waiting bookings', () => {
    it('refuses to guess and asks for the code', async () => {
      const { service, bookingService, whatsappClientService } = buildService([
        villaBooking(),
        villaBooking(OTHER_BOOKING_ID),
      ]);

      const result = await service.handleInboundMessage(inbound('AVAILABLE'));

      expect(result.outcome).toBe(OwnerReplyOutcome.Ambiguous);
      expect(bookingService.update).not.toHaveBeenCalled();

      const [{ message }] = whatsappClientService.sendMessage.mock.calls[0];

      expect(message).toContain('3F2A1B9C');
      expect(message).toContain('AA11BB22');
    });

    it('uses the quoted code to pick the right one', async () => {
      const { service, bookingService } = buildService([
        villaBooking(),
        villaBooking(OTHER_BOOKING_ID),
      ]);

      const result = await service.handleInboundMessage(
        inbound('AVAILABLE AA11BB22'),
      );

      expect(result).toMatchObject({
        outcome: OwnerReplyOutcome.Applied,
        bookingId: OTHER_BOOKING_ID,
      });
      expect(bookingService.update).toHaveBeenCalledWith(
        OTHER_BOOKING_ID,
        expect.anything(),
      );
    });

    it('reads a lower-case code just as well', async () => {
      const { service } = buildService([
        villaBooking(),
        villaBooking(OTHER_BOOKING_ID),
      ]);

      const result = await service.handleInboundMessage(
        inbound('available aa11bb22'),
      );

      expect(result.bookingId).toBe(OTHER_BOOKING_ID);
    });

    it('falls back to the only waiting booking when the code matches nothing', async () => {
      const { service } = buildService([villaBooking()]);

      const result = await service.handleInboundMessage(
        inbound('AVAILABLE deadbeef'),
      );

      expect(result).toMatchObject({
        outcome: OwnerReplyOutcome.Applied,
        bookingId: VILLA_BOOKING_ID,
      });
    });

    it('still refuses to guess when an unmatched code arrives with several waiting', async () => {
      const { service, bookingService } = buildService([
        villaBooking(),
        villaBooking(OTHER_BOOKING_ID),
      ]);

      const result = await service.handleInboundMessage(
        inbound('AVAILABLE deadbeef'),
      );

      expect(result.outcome).toBe(OwnerReplyOutcome.Ambiguous);
      expect(bookingService.update).not.toHaveBeenCalled();
    });
  });

  describe('when things go wrong', () => {
    it('reports a rejected status change instead of pretending it worked', async () => {
      const { service, bookingService } = buildService([villaBooking()]);

      bookingService.update.mockRejectedValue(
        new ConflictException('villa is not available for the selected dates'),
      );

      const result = await service.handleInboundMessage(inbound('AVAILABLE'));

      expect(result).toMatchObject({
        outcome: OwnerReplyOutcome.Failed,
        bookingId: VILLA_BOOKING_ID,
      });
      expect(result.reason).toContain('not available');
    });

    it('does not acknowledge a change that failed', async () => {
      const { service, bookingService, whatsappClientService } = buildService([
        villaBooking(),
      ]);

      bookingService.update.mockRejectedValue(new Error('database is down'));

      await service.handleInboundMessage(inbound('AVAILABLE'));

      expect(whatsappClientService.sendMessage).not.toHaveBeenCalled();
    });

    it('keeps the status change when the acknowledgement cannot be sent', async () => {
      const { service, bookingService, whatsappClientService } = buildService([
        villaBooking(),
      ]);

      whatsappClientService.sendMessage.mockRejectedValue(
        new Error('WhatsApp service unavailable'),
      );

      const result = await service.handleInboundMessage(inbound('AVAILABLE'));

      expect(result.outcome).toBe(OwnerReplyOutcome.Applied);
      expect(bookingService.update).toHaveBeenCalled();
    });
  });

  describe('the query it asks the database', () => {
    it('only considers bookings still waiting on the owner', async () => {
      const { service, queryBuilder } = buildService([villaBooking()]);

      await service.handleInboundMessage(inbound('AVAILABLE'));

      expect(queryBuilder.where).toHaveBeenCalledWith(
        'booking.status IN (:...statuses)',
        {
          statuses: [
            VillaBookingStatus.Requested,
            ActivityBookingStatus.Pending,
          ],
        },
      );
    });

    it('matches the phone number as bare digits, tolerating a leading zero', async () => {
      const { service, queryBuilder } = buildService([villaBooking()]);

      await service.handleInboundMessage(inbound('AVAILABLE', '+62 812-3456'));

      const [sql, params] = queryBuilder.andWhere.mock.calls[0];

      expect(params).toEqual({ phoneNumber: '628123456' });
      expect(sql).toContain('villaOwner');
      expect(sql).toContain('activityOwner');
      expect(sql).toContain(`'^0+'`);
    });
  });
});
