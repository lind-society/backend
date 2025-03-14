import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreateFeatureDto } from './create-feature.dto';
import { FeatureWithRelationsDto } from './feature.dto';

export class UpdateFeatureDto extends PartialType(CreateFeatureDto) {}

export class UpdateFeatureSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<FeatureWithRelationsDto>
{
  readonly data: FeatureWithRelationsDto;

  constructor(data: FeatureWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'update feature success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
