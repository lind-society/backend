import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

/**
 * What a caller is allowed to send when starting a payment on a booking.
 *
 * `POST bookings/:bookingId/payments` is reachable by anyone holding the guest
 * booking link, so it takes this narrow shape rather than the full
 * `CreateBookingPaymentDto` the dashboard uses. That DTO also declares
 * `status`, `paidAt`, `refundedAmount`, `refundedReason`, `cancelledAt` and the
 * gateway reference ids — fields a guest has no business setting, and which the
 * service did not overwrite, so they landed in the record as sent.
 *
 * `amount` is accepted only so a client can state what it believes it owes; the
 * service rejects it unless it equals the outstanding balance it worked out
 * itself.
 */
export class StartBookingPaymentDto {
  @IsString()
  @IsOptional()
  readonly paymentMethod?: string;

  @IsString()
  @IsOptional()
  readonly paymentChannel?: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum amount is 0' })
  @IsOptional()
  readonly amount?: number;
}
