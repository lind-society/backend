import { Owner, OwnerStatus, OwnerType } from 'src/database/entities';
import { PropertyDto } from 'src/modules/property/dto';
import { VillaDto } from 'src/modules/villa/dto';

export interface IOwnerDto extends Omit<Owner, 'properties' | 'villas'> {}

export interface IOwnerWithRelationDto extends IOwnerDto {
  properties: PropertyDto[];
  villas: VillaDto[];
}

export class OwnerDto implements IOwnerDto {
  readonly id!: string;
  readonly name!: string;
  readonly type!: OwnerType;
  readonly companyName!: string | null;
  readonly email!: string;
  readonly phoneNumber!: string;
  readonly address!: string;
  readonly website!: string | null;
  readonly status!: OwnerStatus;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class OwnerWithRelationDto
  extends OwnerDto
  implements IOwnerWithRelationDto
{
  readonly properties: PropertyDto[];
  readonly villas: VillaDto[];
}
