import {
  BookingChannelType,
  PaymentChannel,
} from '@apps/main/database/entities';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

export interface IPaymentChannelDto extends PaymentChannel {}

export interface IPaymentChannelPaginationDto
  extends Omit<PaymentChannel, 'updatedAt' | 'deletedAt'> {}

export interface IRelatedPaymentChannelDto
  extends Pick<PaymentChannel, 'id' | 'name' | 'code' | 'type'> {}

export class PaymentChannelDto implements IPaymentChannelDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly code!: string;

  @Expose()
  readonly description!: string | null;

  @Expose()
  readonly type!: BookingChannelType | null;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: PaymentChannel): PaymentChannelDto {
    return plainToInstance(PaymentChannelDto, entity);
  }

  static fromEntities(entities: PaymentChannel[]): PaymentChannelDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class PaymentChannelPaginationDto
  implements IPaymentChannelPaginationDto
{
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly code!: string;

  @Expose()
  readonly description!: string | null;

  @Expose()
  readonly type!: BookingChannelType | null;

  @Exclude()
  readonly createdAt!: Date;

  static fromEntity(entity: PaymentChannel): PaymentChannelDto {
    return plainToInstance(PaymentChannelDto, entity);
  }

  static fromEntities(entities: PaymentChannel[]): PaymentChannelDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedPaymentChannelDto implements IRelatedPaymentChannelDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly code!: string;

  @Expose()
  readonly type!: BookingChannelType | null;

  static fromEntity(entity: PaymentChannel): PaymentChannelDto {
    return plainToInstance(PaymentChannelDto, entity);
  }

  static fromEntities(entities: PaymentChannel[]): PaymentChannelDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
