import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { PropertyWithRelationsDto } from './property.dto';

export class GetPropertyPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: PropertyWithRelationsDto[];
}

export class GetPropertiesSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetPropertyPaginateDto>
{
  readonly data: GetPropertyPaginateDto;

  constructor(data: GetPropertyPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get properties success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetPropertySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PropertyWithRelationsDto>
{
  readonly data: PropertyWithRelationsDto;

  constructor(data: PropertyWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'get property success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
