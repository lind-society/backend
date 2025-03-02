import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { FacilityCategory } from 'src/database/entities';
import { FacilityDto } from 'src/modules/facility/dto';

export interface IFacilityCategoryDto
  extends Pick<
    FacilityCategory,
    'id' | 'name' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

export interface IFacilityCategoryWithRelationsDto
  extends IFacilityCategoryDto {
  facilities: FacilityDto[];
}

export class FacilityCategoryDto implements IFacilityCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  readonly id!: string;

  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsDate()
  @IsNotEmpty()
  readonly createdAt!: Date;

  @IsDate()
  @IsOptional()
  readonly updatedAt!: Date | null;

  @IsDate()
  @IsOptional()
  readonly deletedAt!: Date | null;
}

export class FacilityCategoryWithRelationsDto
  extends FacilityCategoryDto
  implements IFacilityCategoryDto
{
  readonly facilites?: FacilityDto[];
}

export class FacilityCategoryWithFacilityCategoryPivotIdDto extends FacilityCategoryDto {
  facilityCategoryPivotId!: string | null;
}
