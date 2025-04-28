import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreateVillaBookingDto } from './create-villa-booking.dto';
import { VillaBookingWithRelationsDto } from './villa-booking.dto';

export class UpdateVillaBookingDto extends PartialType(CreateVillaBookingDto) {}

export class UpdateVillaBookingSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaBookingWithRelationsDto>
{
  readonly data: VillaBookingWithRelationsDto;

  constructor(data: VillaBookingWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'update villa booking success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
