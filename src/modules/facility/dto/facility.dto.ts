import { Facility, FacilityType } from 'src/database/entities';
import { PropertyDto } from 'src/modules/property/dto/property.dto';
import { IconDto } from 'src/modules/shared/dto';
import { VillaDto } from 'src/modules/villa/dto';

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
