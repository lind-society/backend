import { BookingType } from '@apps/main/database/entities';
import { AnyBookingStatus } from '../helper/booking-status.helper';

/**
 * Payload of the `booking.status.changed` event.
 *
 * The statuses travel with the event on purpose: listeners run asynchronously
 * and may re-read the booking over another connection, so the row they see is
 * not guaranteed to carry the transition that triggered them.
 */
export interface BookingStatusChangedEventDto {
  bookingId: string;
  bookingType: BookingType;
  previousStatus: AnyBookingStatus | null;
  currentStatus: AnyBookingStatus;
  closedReason: string | null;
}
