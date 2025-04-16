import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { AdminDto } from './admin.dto';
import { CreateAdminDto } from './create-admin.dto';

export class UpdateAdminDto extends PartialType(
  OmitType(CreateAdminDto, ['password'] as const),
) {}

export class UpdateAdminSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<AdminDto>
{
  readonly data: AdminDto;

  constructor(data: AdminDto) {
    super({
      code: HttpStatus.OK,
      message: 'update admin success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class UpdateAdminPasswordSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<AdminDto>
{
  readonly data: AdminDto;

  constructor(data: AdminDto) {
    super({
      code: HttpStatus.OK,
      message: 'update admin password success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class UpdateProfileSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<AdminDto>
{
  readonly data: AdminDto;

  constructor(data: AdminDto) {
    super({
      code: HttpStatus.OK,
      message: 'update profile success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
