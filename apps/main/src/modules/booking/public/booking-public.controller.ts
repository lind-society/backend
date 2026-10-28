import { Public, SkipHal } from '@apps/main/common/decorators';
import { Controller, Get, Param } from '@nestjs/common';
import { BookingService } from '../booking.service';
import { BookingAccessService } from '../helper/booking-access.service';
import { BookingPublicDto, GetPublicBookingSuccessResponse } from './dto';

/**
 * The guest-facing half of the booking flow.
 *
 * Guests never create an account, so the link they receive over WhatsApp is
 * their credential: `GET /bookings/public/:accessToken` is the only booking
 * endpoint open to the world, it returns a trimmed-down payload, and it stops
 * answering as soon as the booking is closed or the link expires.
 */
@Controller('bookings/public')
export class BookingPublicController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly bookingAccessService: BookingAccessService,
  ) {}

  @Public()
  @SkipHal()
  @Get(':accessToken')
  async findByAccessToken(@Param('accessToken') accessToken: string) {
    const { bookingId } =
      await this.bookingAccessService.resolveByAccessToken(accessToken);

    const booking = await this.bookingService.findOne(bookingId);

    return new GetPublicBookingSuccessResponse(new BookingPublicDto(booking));
  }
}
