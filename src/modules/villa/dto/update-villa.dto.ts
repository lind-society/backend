import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreateVillaDto } from './create-villa.dto';
import { VillaWithRelationsDto } from './villa.dto';

export class UpdateVillaDto extends PartialType(CreateVillaDto) {}

export class UpdateVillaSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaWithRelationsDto>
{
  readonly data: VillaWithRelationsDto;

  constructor(data: VillaWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'update villa success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
