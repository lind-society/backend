import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import { AdditionalDto } from 'src/modules/additional/dto';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';

export class GetAdditionalParamsDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}

export class GetAdditionalsDto {
  @IsUUID()
  @IsOptional()
  additionalId?: string | null;
}

export class GetAdditionalPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: AdditionalDto[];
}

export class GetAdditionalsSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetAdditionalPaginateDto>
{
  readonly data: GetAdditionalPaginateDto;

  constructor(data: GetAdditionalPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get additionals success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetAdditionalSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<AdditionalDto>
{
  readonly data: AdditionalDto;

  constructor(data: AdditionalDto) {
    super({
      code: HttpStatus.OK,
      message: 'get additional success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
