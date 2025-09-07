import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PaymentChannelType {
  Card = 'card',
  DebitCard = 'debit_card',
  CreditCard = 'credit_card',
  EWallet = 'e_wallet',
  QRCode = 'qr_code',
  QRIS = 'qris',
  DirectDebit = 'direct_debit',
  VirtualAccount = 'virtual_account',
  OverTheCounter = 'over_the_counter',
}

@Entity({ name: 'payment_channels' })
export class PaymentChannel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  code!: string;

  @Column({ type: 'enum', enum: PaymentChannelType, nullable: true })
  type!: PaymentChannelType | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    select: false,
  })
  deletedAt!: Date | null;
}
