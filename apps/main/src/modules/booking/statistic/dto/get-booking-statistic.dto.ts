import { BookingType } from '@apps/main/database/entities';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsMaxYear(
  maxYearOffset = 0, // e.g. 0 = current year, 1 = next year
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMaxYear',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const currentYear = new Date().getFullYear() + maxYearOffset;
          return typeof value === 'number' && value <= currentYear;
        },
        defaultMessage(args: ValidationArguments) {
          const currentYear = new Date().getFullYear() + maxYearOffset;
          return `year must be less than or equal to ${currentYear}`;
        },
      },
    });
  };
}

export class GetBookingTypeDto {
  @IsEnum(BookingType, {
    message: `booking type must be one of: ${Object.values(BookingType).join(', ')}`,
  })
  @IsOptional()
  type?: BookingType;
}

export class GetBookingDailyQueryDto extends GetBookingTypeDto {
  @Type(() => Date)
  @IsDate({ message: 'date must be a valid date' })
  @IsOptional()
  date!: string;
}

export class GetBookingMonthlyQueryDto extends GetBookingTypeDto {
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'month must be a valid number' },
  )
  @Min(1, { message: 'month must be in range 1 - 12' })
  @Max(12, { message: 'month must be in range 1 - 12' })
  @IsNotEmpty()
  month!: number;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'year must be a valid number' },
  )
  @Min(1900, { message: 'year must be in range 1900 - now' })
  @IsMaxYear(0)
  @IsOptional()
  year?: number;
}

export class GetBookingYearlyQueryDto extends GetBookingTypeDto {
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'year must be a valid number' },
  )
  @Min(1900, { message: 'year must be in range 1900 - now' })
  @IsMaxYear(0)
  @IsNotEmpty()
  year!: number;
}

export class GetBookingWithinDateRangeQueryDto extends GetBookingTypeDto {
  @Type(() => Date)
  @IsDate({ message: 'start date must be a valid date' })
  @IsOptional()
  startDate!: string;

  @Type(() => Date)
  @IsDate({ message: 'end date must be a valid date' })
  @IsOptional()
  endDate!: string;
}
