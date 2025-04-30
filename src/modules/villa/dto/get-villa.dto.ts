import { HttpStatus } from '@nestjs/common';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
import { VillaWithRelationsDto } from './villa.dto';

export class GetVillaPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: VillaWithRelationsDto[];
}

export class GetVillasSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetVillaPaginateDto>
{
  readonly data: GetVillaPaginateDto;

  constructor(data: GetVillaPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get villas success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetVillaSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaWithRelationsDto>
{
  readonly data: VillaWithRelationsDto;

  constructor(data: VillaWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'get villa success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
