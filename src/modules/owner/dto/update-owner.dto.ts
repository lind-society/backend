import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreateOwnerDto } from './create-owner.dto';
import { OwnerDto } from './owner.dto';

export class UpdateOwnerDto extends PartialType(CreateOwnerDto) {}

export class UpdateOwnerSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<OwnerDto>
{
  readonly data: OwnerDto;

  constructor(data: OwnerDto) {
    super({
      code: HttpStatus.OK,
      message: 'update owner success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
