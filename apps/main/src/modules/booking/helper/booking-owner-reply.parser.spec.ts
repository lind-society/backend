import {
  buildBookingCode,
  OwnerReplyIntent,
  parseOwnerReply,
} from './booking-owner-reply.parser';

describe('parseOwnerReply', () => {
  describe('positive answers', () => {
    it.each([
      'AVAILABLE',
      'available',
      'Available',
      '*AVAILABLE*',
      'available 👍',
      'yes it is available',
      'available, please proceed',
      'avail',
      'TERSEDIA',
      'masih ada kak',
      'unitnya kosong',
      'bisa dibooking',
    ])('reads %j as available', (message) => {
      expect(parseOwnerReply(message).intent).toBe(OwnerReplyIntent.Available);
    });
  });

  describe('negative answers', () => {
    it.each([
      'NOT AVAILABLE',
      'not available',
      '*NOT AVAILABLE*',
      'Not Available 🙏',
      'notavailable',
      'unavailable',
      'sorry, not available for those dates',
      'TIDAK TERSEDIA',
      'tidak ada',
      'gak bisa',
      'nggak kosong',
      'sudah booking',
      'penuh',
      'fully booked',
      'already booked',
      'villa full',
    ])('reads %j as not available', (message) => {
      expect(parseOwnerReply(message).intent).toBe(
        OwnerReplyIntent.NotAvailable,
      );
    });

    // The single most dangerous failure mode: "not available" contains
    // "available", so a naive check would open payment on a taken villa.
    it('never reads a refusal as a confirmation', () => {
      const refusals = [
        'not available',
        'NOT AVAILABLE 3f2a1b9c',
        'that one is not available sorry',
        'tidak tersedia',
      ];

      for (const refusal of refusals) {
        expect(parseOwnerReply(refusal).intent).not.toBe(
          OwnerReplyIntent.Available,
        );
      }
    });
  });

  describe('answers that carry no decision', () => {
    it.each([
      '',
      '   ',
      'ok',
      'thanks',
      'siap',
      'let me check with the housekeeper',
      'who is this?',
      '👍',
      '?',
    ])('reads %j as unknown', (message) => {
      expect(parseOwnerReply(message).intent).toBe(OwnerReplyIntent.Unknown);
    });

    it('survives a non-string payload', () => {
      expect(parseOwnerReply(null as never).intent).toBe(
        OwnerReplyIntent.Unknown,
      );
      expect(parseOwnerReply(undefined as never).intent).toBe(
        OwnerReplyIntent.Unknown,
      );
      expect(parseOwnerReply(42 as never).intent).toBe(OwnerReplyIntent.Unknown);
    });
  });

  describe('booking code', () => {
    it('picks up a quoted code', () => {
      expect(parseOwnerReply('AVAILABLE 3F2A1B9C')).toEqual({
        intent: OwnerReplyIntent.Available,
        bookingCode: '3f2a1b9c',
      });
    });

    it('picks up a code from a refusal too', () => {
      expect(parseOwnerReply('not available 3f2a1b9c')).toEqual({
        intent: OwnerReplyIntent.NotAvailable,
        bookingCode: '3f2a1b9c',
      });
    });

    it('picks up a code written in lower case or wrapped in punctuation', () => {
      expect(parseOwnerReply('available (3f2a1b9c)').bookingCode).toBe(
        '3f2a1b9c',
      );
      expect(parseOwnerReply('AVAILABLE - 3f2a1b9c.').bookingCode).toBe(
        '3f2a1b9c',
      );
    });

    it('reports no code when none was quoted', () => {
      expect(parseOwnerReply('AVAILABLE').bookingCode).toBeNull();
    });

    it('does not mistake the keyword itself for a code', () => {
      // "available" and "tersedia" contain non-hex letters, so they can never
      // be read as a booking code.
      expect(parseOwnerReply('available').bookingCode).toBeNull();
      expect(parseOwnerReply('tidak tersedia').bookingCode).toBeNull();
    });

    it('ignores hex-looking fragments that are the wrong length', () => {
      expect(parseOwnerReply('available 3f2a1b').bookingCode).toBeNull();
      expect(parseOwnerReply('available 3f2a1b9c1d').bookingCode).toBeNull();
    });

    it('keeps a code even when the message says nothing decisive', () => {
      expect(parseOwnerReply('hmm 3f2a1b9c')).toEqual({
        intent: OwnerReplyIntent.Unknown,
        bookingCode: '3f2a1b9c',
      });
    });
  });
});

describe('buildBookingCode', () => {
  it('takes the first eight characters of the uuid, upper-cased', () => {
    expect(buildBookingCode('3f2a1b9c-1234-4567-89ab-cdef01234567')).toBe(
      '3F2A1B9C',
    );
  });

  it('round-trips with what the parser reads back out of a reply', () => {
    const bookingId = '3f2a1b9c-1234-4567-89ab-cdef01234567';
    const code = buildBookingCode(bookingId);

    const parsed = parseOwnerReply(`AVAILABLE ${code}`);

    expect(parsed.bookingCode?.toUpperCase()).toBe(code);
  });

  it('survives a missing id', () => {
    expect(buildBookingCode(undefined as never)).toBe('');
  });
});
