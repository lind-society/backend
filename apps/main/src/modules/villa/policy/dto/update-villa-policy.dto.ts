import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { CreateVillaPolicyDto } from './create-villa-policy.dto';
import { VillaPolicyWithRelationsDto } from './villa-policy.dto';

export class UpdateVillaPolicyDto extends PartialType(CreateVillaPolicyDto) {}

export class UpdateVillaPolicySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaPolicyWithRelationsDto>
{
  readonly data: VillaPolicyWithRelationsDto;

  constructor(data: VillaPolicyWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'update villa policy success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
