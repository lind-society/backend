import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsOptional, IsUUID } from 'class-validator';
import { VillaBookingWithRelationsDto } from './villa-booking.dto';

export class GetVillaBookingsDto {
  @IsUUID()
  @IsOptional()
  customerId?: string;
}

export class GetVillaBookingPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: VillaBookingWithRelationsDto[];
}

export class GetVillaBookingsSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetVillaBookingPaginateDto>
{
  readonly data: GetVillaBookingPaginateDto;

  constructor(data: GetVillaBookingPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get villa bookings success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetVillaBookingSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaBookingWithRelationsDto>
{
  readonly data: VillaBookingWithRelationsDto;

  constructor(data: VillaBookingWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'get villa booking success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
