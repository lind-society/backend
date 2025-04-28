import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { ActivityBookingWithRelationsDto } from './activity-booking.dto';
import { CreateActivityBookingDto } from './create-activity-booking.dto';

export class UpdateActivityBookingDto extends PartialType(CreateActivityBookingDto) {}

export class UpdateActivityBookingSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<ActivityBookingWithRelationsDto>
{
  readonly data: ActivityBookingWithRelationsDto;

  constructor(data: ActivityBookingWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'update activity booking success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
