import { Additional, AdditionalType } from 'src/database/entities';
import { PropertyDto } from 'src/modules/property/dto/property.dto';
import { MediaDto } from '../media/dto/media.dto';

export interface IAdditionalDto
  extends Omit<Additional, 'medias' | 'propertyAdditionals'> {}

export interface IAdditionalWithRelationsDto extends IAdditionalDto {
  medias?: MediaDto[];
  properties?: PropertyDto[];
}

export class AdditionalDto implements IAdditionalDto {
  readonly id!: string;
  readonly name!: string;
  readonly type!: AdditionalType;
  readonly description: string | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class AdditionalWithRelationsDto
  extends AdditionalDto
  implements IAdditionalWithRelationsDto
{
  readonly medias?: MediaDto[];
  readonly properties?: PropertyDto[];
}
