import { Feature } from 'src/database/entities';
import { PropertyDto } from 'src/modules/property/dto/property.dto';

export interface IFeatureDto extends Omit<Feature, 'propertyFeatures'> {}

export interface IFeatureWithRelationsDto extends IFeatureDto {
  properties?: PropertyDto[];
}

export class FeatureDto implements IFeatureDto {
  readonly id!: string;
  readonly name!: string;
  readonly icon!: string | null;
  readonly free!: boolean;
  readonly price!: number | null;
  readonly priceCurrency!: string | null;
  readonly list!: string[] | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class FeatureWithRelationsDto
  extends FeatureDto
  implements IFeatureWithRelationsDto
{
  readonly properties?: PropertyDto[];
}
