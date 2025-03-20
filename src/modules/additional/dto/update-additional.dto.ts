import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { AdditionalWithRelationsDto } from './additional.dto';
import { CreateAdditionalDto } from './create-additional.dto';

export class UpdateAdditionalDto extends PartialType(CreateAdditionalDto) {}

export class UpdateAdditionalSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<AdditionalWithRelationsDto>
{
  readonly data: AdditionalWithRelationsDto;

  constructor(data: AdditionalWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'update additional success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
