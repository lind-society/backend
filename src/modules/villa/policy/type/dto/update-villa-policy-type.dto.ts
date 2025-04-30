import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreateVillaPolicyTypeDto } from './create-villa-policy-type.dto';
import { VillaPolicyTypeWithRelationsDto } from './villa-policy-type.dto';

export class UpdateVillaPolicyTypeDto extends PartialType(
  CreateVillaPolicyTypeDto,
) {}

export class UpdateVillaPolicyTypeSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaPolicyTypeWithRelationsDto>
{
  readonly data: VillaPolicyTypeWithRelationsDto;

  constructor(data: VillaPolicyTypeWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'update villa policy type success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
