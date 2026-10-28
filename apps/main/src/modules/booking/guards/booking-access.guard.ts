import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../../auth/guards';
import { BookingAccessService } from '../helper/booking-access.service';

export const BOOKING_ACCESS_TOKEN_HEADER = 'x-booking-token';

/**
 * Guards the booking-scoped payment endpoints, which have two legitimate
 * callers:
 *
 * - an admin working the dashboard, authenticated with a JWT;
 * - the guest themselves, who never logs in and instead proves ownership with
 *   the token from their booking link.
 *
 * The token is checked against the `bookingId` in the route, so it only ever
 * unlocks the one booking it belongs to. When no token is supplied the request
 * falls through to the normal admin authentication.
 */
@Injectable()
export class BookingAccessGuard extends JwtAuthGuard {
  constructor(
    reflector: Reflector,
    private bookingAccessService: BookingAccessService,
  ) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers?.[BOOKING_ACCESS_TOKEN_HEADER];

    if (!accessToken) {
      return (await super.canActivate(context)) as boolean;
    }

    await this.bookingAccessService.assertAccessToBooking(
      request.params?.bookingId,
      Array.isArray(accessToken) ? accessToken[0] : accessToken,
    );

    // Marks the request as guest-authorised, so handlers can tell it apart from
    // an admin session if they ever need to.
    request.bookingAccess = { bookingId: request.params?.bookingId };

    return true;
  }
}
