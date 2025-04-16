import { Facility, FacilityType } from '@apps/main/database/entities';
import { PropertyDto } from '@apps/main/modules/property/dto/property.dto';
import { IconDto } from '@apps/main/modules/shared/dto';
import { VillaDto } from '@apps/main/modules/villa/dto';

export interface IFacilityDto
  extends Omit<Facility, 'propertyFacilities' | 'villaFacilities'> {}

export interface IFacilityWithRelationsDto extends IFacilityDto {
  properties?: PropertyDto[];
  villas?: VillaDto[];
}

export class FacilityDto implements IFacilityDto {
  readonly id!: string;
  readonly name!: string;
  readonly icon!: IconDto | null;
  readonly type!: FacilityType;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class FacilityWithRelationsDto
  extends FacilityDto
  implements IFacilityWithRelationsDto
{
  readonly properties?: PropertyDto[];
  readonly villas?: VillaDto[];
}
