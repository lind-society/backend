import { DefaultHttpStatus } from '@apps/main/common/enums';
import { OnlyOneFieldAllowedConstraint } from '@apps/main/common/validations';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  Validate,
  ValidateIf,
} from 'class-validator';
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
  @IsOptional()
  readonly activityBookingId?: string;

  @IsUUID()
  @IsOptional()
  readonly villaBookingId?: string;

  @IsUUID()
  @IsOptional()
  readonly villaId?: string;

  @IsUUID()
  @IsOptional()
  readonly activityId?: string;

  @ValidateIf((o) => !o.activityBookingId && !o.villaBookingId)
  @IsNotEmpty({
    message:
      'At least one of activityBookingId or villaBookingId must be provided',
  })
  readonly _atLeastOneBookingIdRequired?: string;

  @Validate(OnlyOneFieldAllowedConstraint, [
    'activityBookingId',
    'villaBookingId',
  ])
  readonly _onlyOneBookingIdAllowed?: string;

  @ValidateIf((o) => !o.activityId && !o.villaId)
  @IsNotEmpty({
    message: 'At least one of activityId or villaId must be provided',
  })
  readonly _atLeastOneIdRequired?: string;

  @Validate(OnlyOneFieldAllowedConstraint, ['activityId', 'villaId'])
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
