import {
  ActivityBookingStatus,
  BookingType,
  VillaBookingStatus,
} from '@apps/main/database/entities';
import { BadRequestException } from '@nestjs/common';
import {
  assertBookingStatusTransition,
  canTransitionBookingStatus,
  isBookingOpenForPayment,
  isClosedBookingStatus,
} from './booking-status.helper';

describe('booking status helper', () => {
  describe('villa flow', () => {
    it('walks the happy path from inquiry to done', () => {
      const path: VillaBookingStatus[] = [
        VillaBookingStatus.Requested,
        VillaBookingStatus.WaitingForPayment,
        VillaBookingStatus.Booked,
        VillaBookingStatus.CheckedIn,
        VillaBookingStatus.Done,
      ];

      path.slice(0, -1).forEach((status, index) => {
        expect(
          canTransitionBookingStatus(
            BookingType.Villa,
            status,
            path[index + 1],
          ),
        ).toBe(true);
      });
    });

    it('allows negotiation to loop back into payment', () => {
      expect(
        canTransitionBookingStatus(
          BookingType.Villa,
          VillaBookingStatus.WaitingForPayment,
          VillaBookingStatus.Negotiation,
        ),
      ).toBe(true);
    });

    it('refuses to mark a booking as booked straight from an inquiry', () => {
      expect(
        canTransitionBookingStatus(
          BookingType.Villa,
          VillaBookingStatus.Requested,
          VillaBookingStatus.Booked,
        ),
      ).toBe(false);
    });

    it('refuses to revive a cancelled booking', () => {
      expect(
        canTransitionBookingStatus(
          BookingType.Villa,
          VillaBookingStatus.Canceled,
          VillaBookingStatus.WaitingForPayment,
        ),
      ).toBe(false);
    });

    it('still allows a refund to cancel a checked-in booking', () => {
      expect(
        canTransitionBookingStatus(
          BookingType.Villa,
          VillaBookingStatus.CheckedIn,
          VillaBookingStatus.Canceled,
        ),
      ).toBe(true);
    });
  });

  describe('activity flow', () => {
    it('cannot skip confirmation', () => {
      expect(
        canTransitionBookingStatus(
          BookingType.Activity,
          ActivityBookingStatus.Pending,
          ActivityBookingStatus.Completed,
        ),
      ).toBe(false);
    });
  });

  describe('idempotency', () => {
    it('treats a repeated status as a no-op, so duplicate gateway callbacks are safe', () => {
      expect(
        canTransitionBookingStatus(
          BookingType.Villa,
          VillaBookingStatus.Booked,
          VillaBookingStatus.Booked,
        ),
      ).toBe(true);
    });

    it('drops a stale pending callback arriving after payment', () => {
      expect(
        canTransitionBookingStatus(
          BookingType.Villa,
          VillaBookingStatus.Booked,
          VillaBookingStatus.WaitingForPayment,
        ),
      ).toBe(false);
    });
  });

  describe('assertBookingStatusTransition', () => {
    it('names the allowed next statuses when it rejects', () => {
      expect(() =>
        assertBookingStatusTransition(
          BookingType.Villa,
          VillaBookingStatus.Requested,
          VillaBookingStatus.Done,
        ),
      ).toThrow(BadRequestException);
    });

    it('reports a final status as final', () => {
      expect(() =>
        assertBookingStatusTransition(
          BookingType.Villa,
          VillaBookingStatus.Done,
          VillaBookingStatus.Canceled,
        ),
      ).toThrow(/final/);
    });
  });

  describe('link and payment gates', () => {
    it('closes the link only once the booking is cancelled', () => {
      expect(isClosedBookingStatus(VillaBookingStatus.Canceled)).toBe(true);
      expect(isClosedBookingStatus(VillaBookingStatus.Done)).toBe(false);
      expect(isClosedBookingStatus(VillaBookingStatus.Negotiation)).toBe(false);
    });

    it('opens payment for villas only at waiting_for_payment', () => {
      expect(
        isBookingOpenForPayment(
          BookingType.Villa,
          VillaBookingStatus.WaitingForPayment,
        ),
      ).toBe(true);
      expect(
        isBookingOpenForPayment(
          BookingType.Villa,
          VillaBookingStatus.Requested,
        ),
      ).toBe(false);
      expect(
        isBookingOpenForPayment(
          BookingType.Activity,
          ActivityBookingStatus.Pending,
        ),
      ).toBe(true);
    });
  });
});
