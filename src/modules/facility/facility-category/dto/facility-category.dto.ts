import { FacilityCategory } from 'src/database/entities/facility-category.entity';
import { FacilityDto } from 'src/modules/facility/dto/facility.dto';

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
  readonly id!: string;
  readonly name!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class FacilityCategoryWithFacilityCategoryPivotIdDto extends FacilityCategoryDto {
  facilityCategoryPivotId!: string | null;
}
