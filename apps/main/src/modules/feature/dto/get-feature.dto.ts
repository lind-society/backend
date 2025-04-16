import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsOptional, IsUUID } from 'class-validator';
import { FeatureDto } from './feature.dto';

export class GetFeaturesDto {
  @IsUUID()
  @IsOptional()
  propertyId?: string;

  @IsUUID()
  @IsOptional()
  villaId?: string;
}

export class GetFeaturePaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: FeatureDto[];
}

export class GetFeaturesSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetFeaturePaginateDto>
{
  readonly data: GetFeaturePaginateDto;

  constructor(data: GetFeaturePaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get features success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetFeatureSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<FeatureDto>
{
  readonly data: FeatureDto;

  constructor(data: FeatureDto) {
    super({
      code: HttpStatus.OK,
      message: 'get feature success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
