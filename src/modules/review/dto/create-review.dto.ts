import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { ReviewWithRelationsDto } from './review.dto';

export class CreateReviewDto {
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'rating must be a valid number' },
  )
  @Min(0, { message: 'minimum rating is 0' })
  @Max(5, { message: 'maximum rating is 5' })
  @IsNotEmpty()
  readonly rating!: number;

  @IsString()
  @IsNotEmpty()
  readonly message!: string;

  @IsUUID()
  @IsNotEmpty()
  readonly bookingId: string;

  @IsUUID()
  @IsOptional()
  readonly activityId!: string;

  @IsUUID()
  @IsOptional()
  readonly propertyId!: string;

  @IsUUID()
  @IsOptional()
  readonly villaId!: string;

  @ValidateIf((o) => !o.activityId && !o.propertyId && !o.villaId)
  @IsNotEmpty({
    message:
      'At least one of activityId, propertyId, or villaId must be provided',
  })
  readonly _atLeastOneIdRequired?: string;

  @ValidateIf(
    (o) =>
      (o.activityId && o.propertyId) ||
      (o.activityId && o.villaId) ||
      (o.propertyId && o.villaId),
  )
  @IsEmpty({
    message: 'Only one of activityId, propertyId, or villaId can be provided',
  })
  readonly _onlyOneIdAllowed?: string;
}

export class CreateReviewSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<ReviewWithRelationsDto>
{
  readonly data: ReviewWithRelationsDto;

  constructor(data: ReviewWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create review success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
