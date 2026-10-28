import {
  ActivityBookingStatus,
  BookingType,
  VillaBookingStatus,
} from '@apps/main/database/entities';
import { BadRequestException } from '@nestjs/common';

export type AnyBookingStatus = ActivityBookingStatus | VillaBookingStatus;

/**
 * Allowed status transitions for a villa (rent) booking.
 *
 * The flow is admin-driven: a guest sends an inquiry (`requested`), the admin
 * confirms availability with the owner over WhatsApp and either opens payment
 * (`waiting_for_payment`) or negotiates an alternative villa (`negotiation`).
 * `waiting_for_payment` can fall back to `negotiation` when the guest changes
 * their mind before paying.
 */
export const VILLA_BOOKING_STATUS_TRANSITIONS: Record<
  VillaBookingStatus,
  VillaBookingStatus[]
> = {
  [VillaBookingStatus.Requested]: [
    VillaBookingStatus.Negotiation,
    VillaBookingStatus.WaitingForPayment,
    VillaBookingStatus.Canceled,
  ],
  [VillaBookingStatus.Negotiation]: [
    VillaBookingStatus.WaitingForPayment,
    VillaBookingStatus.Canceled,
  ],
  [VillaBookingStatus.WaitingForPayment]: [
    VillaBookingStatus.Booked,
    VillaBookingStatus.Negotiation,
    VillaBookingStatus.Canceled,
  ],
  [VillaBookingStatus.Booked]: [
    VillaBookingStatus.CheckedIn,
    VillaBookingStatus.Canceled,
  ],
  // Cancellation stays reachable after check-in so a gateway-initiated refund
  // can still close the booking out.
  [VillaBookingStatus.CheckedIn]: [
    VillaBookingStatus.Done,
    VillaBookingStatus.Canceled,
  ],
  [VillaBookingStatus.Done]: [],
  [VillaBookingStatus.Canceled]: [],
};

export const ACTIVITY_BOOKING_STATUS_TRANSITIONS: Record<
  ActivityBookingStatus,
  ActivityBookingStatus[]
> = {
  [ActivityBookingStatus.Pending]: [
    ActivityBookingStatus.Confirmed,
    ActivityBookingStatus.Canceled,
  ],
  [ActivityBookingStatus.Confirmed]: [
    ActivityBookingStatus.Completed,
    ActivityBookingStatus.Canceled,
  ],
  [ActivityBookingStatus.Completed]: [],
  [ActivityBookingStatus.Canceled]: [],
};

/**
 * Statuses that close the public link for good. Everything else — including
 * `done` / `completed` — stays readable so the guest can still pull up their
 * booking confirmation after the stay.
 */
// Both enums spell cancellation the same way ('canceled'), so one entry covers
// villa and activity bookings alike.
export const CLOSED_BOOKING_STATUSES: AnyBookingStatus[] = [
  VillaBookingStatus.Canceled,
];

/**
 * Statuses reached only after the money is in. A booking sitting on one of
 * these must not accept another payment.
 */
export const FINALIZED_BOOKING_STATUSES: AnyBookingStatus[] = [
  VillaBookingStatus.Booked,
  VillaBookingStatus.CheckedIn,
  VillaBookingStatus.Done,
  ActivityBookingStatus.Confirmed,
  ActivityBookingStatus.Completed,
];

/**
 * Statuses that make a villa genuinely occupied for a date range. Inquiries
 * (`requested` / `negotiation`) deliberately do NOT block, because availability
 * at that point is still being confirmed manually with the owner and several
 * guests may be asking about the same dates.
 */
export const OCCUPYING_VILLA_BOOKING_STATUSES: VillaBookingStatus[] = [
  VillaBookingStatus.WaitingForPayment,
  VillaBookingStatus.Booked,
  VillaBookingStatus.CheckedIn,
];

export function getBookingStatusTransitions(
  bookingType: BookingType,
  status: AnyBookingStatus,
): AnyBookingStatus[] {
  const transitions =
    bookingType === BookingType.Activity
      ? ACTIVITY_BOOKING_STATUS_TRANSITIONS
      : VILLA_BOOKING_STATUS_TRANSITIONS;

  return transitions[status as keyof typeof transitions] ?? [];
}

/**
 * Non-throwing variant, used by the payment-gateway listeners: a late or
 * duplicated callback must never blow up the webhook handler, it should just
 * leave the booking status alone.
 */
export function canTransitionBookingStatus(
  bookingType: BookingType,
  currentStatus: AnyBookingStatus,
  nextStatus: AnyBookingStatus,
): boolean {
  // Re-applying the same status is a no-op, not an error. Payment callbacks are
  // delivered at-least-once and routinely repeat a status we already stored.
  if (currentStatus === nextStatus) {
    return true;
  }

  // A booking with no status yet (legacy rows) can move anywhere valid.
  if (!currentStatus) {
    return true;
  }

  return getBookingStatusTransitions(bookingType, currentStatus).includes(
    nextStatus,
  );
}

export function assertBookingStatusTransition(
  bookingType: BookingType,
  currentStatus: AnyBookingStatus,
  nextStatus: AnyBookingStatus,
): void {
  if (canTransitionBookingStatus(bookingType, currentStatus, nextStatus)) {
    return;
  }

  const allowed = getBookingStatusTransitions(bookingType, currentStatus);

  throw new BadRequestException(
    allowed.length
      ? `cannot change booking status from ${currentStatus} to ${nextStatus}, allowed next status: ${allowed.join(', ')}`
      : `booking status ${currentStatus} is final and cannot be changed`,
  );
}

export function isClosedBookingStatus(status: AnyBookingStatus): boolean {
  return CLOSED_BOOKING_STATUSES.includes(status);
}

/**
 * A booking is "open for payment" only while the admin has explicitly parked it
 * at the payment step. For activities the equivalent step is `pending`, since
 * an activity is payable straight after the inquiry.
 */
export function isBookingOpenForPayment(
  bookingType: BookingType,
  status: AnyBookingStatus,
): boolean {
  return bookingType === BookingType.Activity
    ? status === ActivityBookingStatus.Pending
    : status === VillaBookingStatus.WaitingForPayment;
}
