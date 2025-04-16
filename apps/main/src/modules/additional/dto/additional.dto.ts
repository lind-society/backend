import { Additional, AdditionalType } from '@apps/main/database/entities';
import { PropertyDto } from '@apps/main/modules/property/dto/property.dto';
import { VillaDto } from '@apps/main/modules/villa/dto';

export interface IAdditionalDto
  extends Omit<Additional, 'propertyAdditionals' | 'villaAdditionals'> {}

export interface IAdditionalWithRelationsDto extends IAdditionalDto {
  properties?: PropertyDto[];
  villas?: VillaDto[];
}

export class AdditionalDto implements IAdditionalDto {
  readonly id!: string;
  readonly name!: string;
  readonly type!: AdditionalType;
  readonly description!: string | null;
  readonly photos!: string[] | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class AdditionalWithRelationsDto
  extends AdditionalDto
  implements IAdditionalWithRelationsDto
{
  readonly properties?: PropertyDto[];
  readonly villas?: VillaDto[];
}
