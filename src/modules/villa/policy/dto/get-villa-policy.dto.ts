import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
import { VillaPolicyDto } from './villa-policy.dto';

export class GetVillaPolicyParamsDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}

export class GetVillaPolicysDto {
  @IsUUID()
  @IsOptional()
  additionalId?: string | null;
}

export class GetVillaPolicyPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: VillaPolicyDto[];
}

export class GetVillaPolicysSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetVillaPolicyPaginateDto>
{
  readonly data: GetVillaPolicyPaginateDto;

  constructor(data: GetVillaPolicyPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get villa policies success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetVillaPolicySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaPolicyDto>
{
  readonly data: VillaPolicyDto;

  constructor(data: VillaPolicyDto) {
    super({
      code: HttpStatus.OK,
      message: 'get villa policy success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
