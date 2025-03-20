import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsDate,
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
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsNotEmpty()
  readonly country!: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly checkIn!: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly checkOut!: Date;

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

  // Should be not null (updated when adding admin entity)
  @IsUUID()
  @IsOptional()
  readonly bookingId?: string | null;

  @IsUUID()
  @IsNotEmpty()
  readonly activityId!: string;

  @IsUUID()
  @IsNotEmpty()
  readonly propertyId!: string;

  @IsUUID()
  @IsNotEmpty()
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
