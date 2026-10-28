import { BookingType } from '@apps/main/database/entities';
import { BookingWithRelationsDto } from '../dto';
import { buildBookingCode } from './booking-owner-reply.parser';

const JAKARTA_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Jakarta',
};

function formatDate(date: Date | string | null): string {
  if (!date) {
    return '-';
  }

  return `${new Date(date).toLocaleString('en-GB', JAKARTA_DATE_OPTIONS)} WIB`;
}

function formatAmount(booking: BookingWithRelationsDto): string {
  return `${booking.currency?.symbol || ''} ${Number(
    booking.totalAmount,
  ).toLocaleString('id-ID')}`;
}

function propertyName(booking: BookingWithRelationsDto): string {
  return booking.type === BookingType.Activity
    ? (booking.activity?.name ?? 'our activity')
    : (booking.villa?.name ?? 'our villa');
}

function propertyAddress(booking: BookingWithRelationsDto): string {
  const target =
    booking.type === BookingType.Activity ? booking.activity : booking.villa;

  if (!target) {
    return '-';
  }

  return [target.address, target.city, target.state, target.country]
    .filter(Boolean)
    .join(', ');
}

/** The date block differs per booking type; everything else is shared. */
function scheduleLines(booking: BookingWithRelationsDto): string {
  if (booking.type === BookingType.Activity) {
    return `🗓️ *Booking Date*: ${formatDate(booking.bookingDate)}`;
  }

  return [
    `🗓️ *Check-in*: ${formatDate(booking.checkInDate)}`,
    `🗓️ *Check-out*: ${formatDate(booking.checkOutDate)}`,
  ].join('\n');
}

function bookingSummary(booking: BookingWithRelationsDto): string {
  const target =
    booking.type === BookingType.Activity ? booking.activity : booking.villa;

  return [
    `🏡 *${booking.type === BookingType.Activity ? 'Activity' : 'Villa'}*: ${propertyName(booking)}${
      target?.secondaryName ? ` (${target.secondaryName})` : ''
    }`,
    `📍 *Address*: ${propertyAddress(booking)}`,
    scheduleLines(booking),
    `👥 *Total Guests*: ${booking.totalGuest}`,
    `💵 *Total Amount*: ${formatAmount(booking)}`,
  ].join('\n');
}

/**
 * Sent to the guest the moment an inquiry lands. It deliberately does NOT say
 * the booking is confirmed — availability has not been checked with the owner
 * yet at this point.
 */
export function buildCustomerInquiryReceivedMessage(
  booking: BookingWithRelationsDto,
  bookingLink: string,
): string {
  return `Hi ${booking.customer?.name}, we have received your reservation request 🎉

${bookingSummary(booking)}

⏳ *Status*: Reservation received — our team is confirming availability with the property.

You can open and track your reservation anytime here:
${bookingLink}

We will message you again on this number as soon as availability is confirmed.`;
}

/**
 * Sent to the property owner so they can confirm availability. Contains the
 * guest's contact details because the admin follows up in the same thread.
 *
 * The booking code is quoted twice — in the summary and in the instruction —
 * because it is what lets the owner's reply be matched to this booking when
 * they have several waiting at once.
 */
export function buildOwnerAvailabilityRequestMessage(
  booking: BookingWithRelationsDto,
): string {
  const owner =
    booking.type === BookingType.Activity
      ? booking.activity?.owner
      : booking.villa?.owner;

  const code = buildBookingCode(booking.id);

  return `Hi ${owner?.name ?? 'there'}, a new reservation request just came in for your property.

🔖 *Booking Code*: ${code}
${bookingSummary(booking)}

👤 *Guest*: ${booking.customer?.name}
📧 *Email*: ${booking.customer?.email}
📱 *Phone*: ${booking.customer?.phoneCountryCode}${booking.customer?.phoneNumber}

Please reply to this message with *AVAILABLE ${code}* or *NOT AVAILABLE ${code}* so we can proceed with the guest.`;
}

/**
 * Confirms to the owner that their reply was understood and acted on. Without
 * it the owner has no way of telling an automated reply from one that fell into
 * a void, and would chase the admin anyway.
 */
export function buildOwnerReplyAcknowledgedMessage(
  booking: BookingWithRelationsDto,
  available: boolean,
): string {
  const code = buildBookingCode(booking.id);

  if (available) {
    return `Thank you 🙏 We have recorded booking *${code}* (${propertyName(booking)}) as *AVAILABLE* and sent the payment link to the guest.

We will let you know once the payment comes through.`;
  }

  return `Thank you 🙏 We have recorded booking *${code}* (${propertyName(booking)}) as *NOT AVAILABLE*.

The dates stay open on our side and our team will offer the guest an alternative.`;
}

/**
 * Sent when an owner replies while several of their bookings are waiting, so
 * there is no safe way to guess which one they meant.
 */
export function buildOwnerReplyAmbiguousMessage(
  bookings: BookingWithRelationsDto[],
): string {
  const list = bookings
    .map(
      (booking) =>
        `• *${buildBookingCode(booking.id)}* — ${propertyName(booking)}, ${
          booking.type === BookingType.Activity
            ? formatDate(booking.bookingDate)
            : `${formatDate(booking.checkInDate)} → ${formatDate(booking.checkOutDate)}`
        }`,
    )
    .join('\n');

  return `Thanks for getting back to us! You have ${bookings.length} requests waiting, so we need to know which one you mean:

${list}

Please reply with the code, for example *AVAILABLE ${buildBookingCode(bookings[0].id)}*.`;
}

/**
 * Sent to the guest when the owner reports the dates as taken. The booking is
 * not closed — the link keeps working — so this message promises a follow-up
 * rather than saying goodbye.
 */
export function buildCustomerNegotiationMessage(
  booking: BookingWithRelationsDto,
  bookingLink: string,
): string {
  return `Hi ${booking.customer?.name}, unfortunately ${propertyName(booking)} is not available for your dates.

${bookingSummary(booking)}

🔎 Our team is already looking for an alternative that fits your dates and will message you here shortly.

Your reservation stays open in the meantime:
${bookingLink}`;
}

/**
 * Sent when the admin has confirmed availability and moved the booking to the
 * payment step.
 */
export function buildCustomerPaymentReadyMessage(
  booking: BookingWithRelationsDto,
  bookingLink: string,
): string {
  return `Good news ${booking.customer?.name}! Your reservation at ${propertyName(booking)} is confirmed as available ✅

${bookingSummary(booking)}

💳 Please complete your payment through the link below to secure your stay:
${bookingLink}

Your reservation is held until the payment is completed.`;
}

/** Sent once the payment gateway reports the booking as paid. */
export function buildCustomerBookingConfirmedMessage(
  booking: BookingWithRelationsDto,
  bookingLink: string,
): string {
  const map =
    booking.type === BookingType.Activity
      ? booking.activity?.mapLink
      : booking.villa?.mapLink;

  return `Thank you ${booking.customer?.name}, your payment has been received and your booking is now confirmed 🎉

${bookingSummary(booking)}
🗺️ *Map*: ${map || '-'}

You can view your booking confirmation here:
${bookingLink}

We look forward to welcoming you!`;
}

/**
 * Sent when a negotiation ends without agreement. The link stops working right
 * after this message, so the message itself has to carry the reason.
 */
export function buildCustomerBookingClosedMessage(
  booking: BookingWithRelationsDto,
  reason?: string | null,
): string {
  return `Hi ${booking.customer?.name}, your reservation request for ${propertyName(booking)} has been closed.

${reason ? `📝 *Reason*: ${reason}\n\n` : ''}Your reservation link is no longer active. If you would like to look for another date or another property, simply reply to this message and our team will help you.`;
}
