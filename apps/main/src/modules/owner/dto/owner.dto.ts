import { constructPhoneNumber } from '@apps/main/common/helpers';
import { Owner, OwnerStatus, OwnerType } from '@apps/main/database/entities';
import { ActivityDto } from '@apps/main/modules/activity/dto';
import { PropertyDto } from '@apps/main/modules/property/dto';
import { VillaDto } from '@apps/main/modules/villa/dto';
import { Expose } from 'class-transformer';

export interface IOwnerDto
  extends Omit<Owner, 'activities' | 'properties' | 'villas'> {}

export interface IOwnerWithRelationDto extends IOwnerDto {
  activities?: ActivityDto[];
  properties?: PropertyDto[];
  villas?: VillaDto[];
}

export class OwnerDto implements IOwnerDto {
  readonly id!: string;
  readonly name!: string;
  readonly type!: OwnerType;
  readonly companyName!: string | null;
  readonly email!: string;
  readonly phoneCountryCode!: string;
  readonly phoneNumber!: string;
  readonly address!: string;
  readonly website!: string | null;
  readonly status!: OwnerStatus;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;

  @Expose()
  get formattedPhoneNumber(): string {
    return constructPhoneNumber(this.phoneCountryCode, this.phoneNumber);
  }
}

export class OwnerWithRelationDto
  extends OwnerDto
  implements IOwnerWithRelationDto
{
  readonly activities?: ActivityDto[];
  readonly properties?: PropertyDto[];
  readonly villas?: VillaDto[];
}
