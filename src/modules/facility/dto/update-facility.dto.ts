import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreateFacilityDto } from './create-facility.dto';
import { FacilityDto } from './facility.dto';

export class UpdateFacilityDto extends PartialType(CreateFacilityDto) {}

export class UpdateFacilitySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<FacilityDto>
{
  readonly data: FacilityDto;

  constructor(data: FacilityDto) {
    super({
      code: HttpStatus.OK,
      message: 'update facility success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
