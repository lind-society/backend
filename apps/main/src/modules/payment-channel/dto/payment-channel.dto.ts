import {
  BookingChannelType,
  PaymentChannel,
} from '@apps/main/database/entities';

export interface IPaymentChannelDto extends PaymentChannel {}

export class PaymentChannelDto implements IPaymentChannelDto {
  readonly id!: string;
  readonly code!: string;
  readonly type!: BookingChannelType | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}
