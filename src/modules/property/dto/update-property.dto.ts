import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreatePropertyDto } from './create-property.dto';
import { PropertyWithRelationsDto } from './property.dto';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {}

export class UpdatePropertySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PropertyWithRelationsDto>
{
  readonly data: PropertyWithRelationsDto;

  constructor(data: PropertyWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'update property success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
