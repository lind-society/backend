/**
 * Reads a property owner's free-text WhatsApp reply and works out whether they
 * said the dates are available.
 *
 * Owners are asked to reply with a fixed keyword, but they are people on a
 * phone: replies arrive as "*NOT AVAILABLE*", "not available bro", "tidak
 * tersedia 🙏", or with the booking code appended. Anything this parser cannot
 * classify confidently is reported as `Unknown` and left for a human — guessing
 * wrong here would move real money.
 */

export enum OwnerReplyIntent {
  Available = 'available',
  NotAvailable = 'not_available',
  Unknown = 'unknown',
}

export interface ParsedOwnerReply {
  intent: OwnerReplyIntent;
  /** The 8-character booking code, when the owner quoted one. */
  bookingCode: string | null;
}

/**
 * Negatives are matched first and win outright, because every phrase for "not
 * available" contains the phrase for "available". Getting this order wrong
 * would read a refusal as a confirmation and open payment on a booked villa.
 */
const NOT_AVAILABLE_PATTERNS: RegExp[] = [
  /\bnot\s*available\b/,
  /\bunavailable\b/,
  /\bnot\s*free\b/,
  /\bno\s*t?\s*avail\b/,
  /\bfully\s*booked\b/,
  /\balready\s*booked\b/,
  /\btidak\s*(tersedia|ada|bisa|kosong|available)\b/,
  /\bgak?\s*(tersedia|ada|bisa|kosong)\b/,
  /\bnggak?\s*(tersedia|ada|bisa|kosong)\b/,
  /\bbelum\s*(tersedia|bisa)\b/,
  /\bsudah\s*(di)?booking\b/,
  /\bsudah\s*(ke)?isi\b/,
  /\b(penuh|terisi|full)\b/,
];

const AVAILABLE_PATTERNS: RegExp[] = [
  /\bavailable\b/,
  /\bavail\b/,
  /\btersedia\b/,
  /\bkosong\b/,
  /\bmasih\s*ada\b/,
  /\bbisa\s*(di)?booking\b/,
];

/**
 * Eight hex characters — the short form of a booking's UUID. Bounded on both
 * sides so it cannot bite a chunk out of a longer word or a phone number.
 */
const BOOKING_CODE_PATTERN = /\b[0-9a-f]{8}\b/i;

/**
 * Flattens WhatsApp's bold/italic markers, punctuation and emoji into plain
 * lower-case words, so `*NOT_AVAILABLE!*` and `not available` parse the same.
 */
function normalise(message: string): string {
  return message
    .toLowerCase()
    .replace(/[*_~`]/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function parseOwnerReply(message: string): ParsedOwnerReply {
  if (!message || typeof message !== 'string') {
    return { intent: OwnerReplyIntent.Unknown, bookingCode: null };
  }

  const normalised = normalise(message);

  if (!normalised) {
    return { intent: OwnerReplyIntent.Unknown, bookingCode: null };
  }

  const bookingCode = extractBookingCode(normalised);

  if (NOT_AVAILABLE_PATTERNS.some((pattern) => pattern.test(normalised))) {
    return { intent: OwnerReplyIntent.NotAvailable, bookingCode };
  }

  if (AVAILABLE_PATTERNS.some((pattern) => pattern.test(normalised))) {
    return { intent: OwnerReplyIntent.Available, bookingCode };
  }

  return { intent: OwnerReplyIntent.Unknown, bookingCode };
}

/**
 * Pulls the booking code out of the reply. Words that happen to be spellable in
 * hex ("available" is not, but "deadbeef" is) are a theoretical false positive;
 * the caller treats the code as a hint and falls back to the owner's pending
 * bookings when it resolves to nothing.
 */
function extractBookingCode(normalised: string): string | null {
  const match = normalised.match(BOOKING_CODE_PATTERN);

  return match ? match[0].toLowerCase() : null;
}

/** The short code shown to the owner, derived from the booking's UUID. */
export function buildBookingCode(bookingId: string): string {
  return (bookingId ?? '').replace(/-/g, '').slice(0, 8).toUpperCase();
}
