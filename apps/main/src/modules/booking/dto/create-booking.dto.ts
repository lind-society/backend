import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  ActivityBookingStatus,
  BookingType,
  VillaBookingStatus,
} from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  registerDecorator,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { CreateBookingCustomerDto } from '../customer/dto';
import { BookingWithRelationsDto } from './booking.dto';
import { UpdateBookingDto } from './update-booking.dto';

// helper function for validation
function IsRequiredForBookingType(
  bookingType: BookingType,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isRequiredForBookingType',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [bookingType],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [requiredBookingType] = args.constraints;
          const obj = args.object as CreateBookingDto;

          // If this is the required booking type, value must be present
          if (obj.type === requiredBookingType) {
            return value !== undefined && value !== null;
          }

          // For other booking types, it's optional
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const [requiredBookingType] = args.constraints;
          return `${args.property} is required when booking type is ${requiredBookingType}`;
        },
      },
    });
  };
}

function IsBookingStatusValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isBookingStatusValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as CreateBookingDto | UpdateBookingDto;

          if (!obj.type) {
            return true;
          }

          // If no status provided, it will be set by transformer
          if (!value) {
            return true; // Let the transformer handle the default
          }

          if (obj.type === BookingType.Activity) {
            return Object.values(ActivityBookingStatus).includes(value);
          }

          if (obj.type === BookingType.Villa) {
            return Object.values(VillaBookingStatus).includes(value);
          }

          return false;
        },
        defaultMessage(args: ValidationArguments) {
          const obj = args.object as CreateBookingDto;

          if (obj.type === BookingType.Activity) {
            return `status must be one of: ${Object.values(ActivityBookingStatus).join(', ')} for activity bookings`;
          }

          if (obj.type === BookingType.Villa) {
            return `status must be one of: ${Object.values(VillaBookingStatus).join(', ')} for villa bookings`;
          }

          return 'Invalid status for the given booking type';
        },
      },
    });
  };
}

export class CreateBookingDto {
  @IsEnum(BookingType, {
    message: `booking type must be one of: ${Object.values(BookingType).join(', ')}`,
  })
  @IsNotEmpty()
  readonly type: BookingType;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'total guest must be a valid number' },
  )
  @Min(1, { message: 'minimum total guest is 1' })
  @IsNotEmpty()
  readonly totalGuest!: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum total amount is 0' })
  @IsNotEmpty()
  readonly totalAmount!: number;

  @ValidateIf((o) => o.bookingType === BookingType.Activity)
  @Type(() => Date)
  @IsDate({ message: 'booking date must be a valid date' })
  @IsNotEmpty()
  @IsRequiredForBookingType(BookingType.Activity)
  readonly bookingDate!: Date;

  @ValidateIf((o) => o.bookingType === BookingType.Villa)
  @Type(() => Date)
  @IsDate({ message: 'check in date must be a valid date' })
  @IsNotEmpty() // only if booking type villa, eitherwise nullable
  @IsRequiredForBookingType(BookingType.Villa)
  readonly checkInDate!: Date;

  @ValidateIf((o) => o.bookingType === BookingType.Villa)
  @Type(() => Date)
  @IsDate({ message: 'check in date must be a valid date' })
  @IsNotEmpty() // only if booking type villa, eitherwise nullable
  @IsRequiredForBookingType(BookingType.Villa)
  readonly checkOutDate!: Date;

  @IsBookingStatusValid()
  @IsOptional()
  status?: ActivityBookingStatus | VillaBookingStatus;

  @IsUUID()
  @IsNotEmpty()
  readonly currencyId!: string;

  @IsUUID()
  @IsOptional()
  readonly customerId?: string;

  @ValidateIf((o) => o.bookingType === BookingType.Activity)
  @IsUUID()
  @IsNotEmpty()
  @IsRequiredForBookingType(BookingType.Activity)
  readonly activityId?: string;

  @ValidateIf((o) => o.bookingType === BookingType.Villa)
  @IsUUID()
  @IsNotEmpty()
  @IsRequiredForBookingType(BookingType.Villa)
  readonly villaId?: string;

  @Type(() => CreateBookingCustomerDto)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  readonly customer!: CreateBookingCustomerDto;
}

export class CreateBookingSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingWithRelationsDto>
{
  readonly data: BookingWithRelationsDto;

  constructor(data: BookingWithRelationsDto, type: BookingType) {
    super({
      code: HttpStatus.CREATED,
      message: `create ${type.toLowerCase()} booking success`,
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
