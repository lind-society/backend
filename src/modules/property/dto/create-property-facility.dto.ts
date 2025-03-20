import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreatePropertyFacililtyDto {
  @IsUUID()
  @IsOptional()
  readonly propertyId?: string;

  @IsUUID()
  @IsNotEmpty()
  readonly facilityId!: string;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => (value === undefined ? false : value))
  includeDescription!: boolean;

  @ValidateIf((o) => o.includeDescription === true)
  @IsString()
  @IsNotEmpty({
    message: 'Description is required when includeDescription is true',
  })
  @ValidateIf((o) => o.includeDescription !== true)
  @IsEmpty({
    message:
      'Description should not be provided when includeDescription is false or null',
  })
  description?: string | null;
}
