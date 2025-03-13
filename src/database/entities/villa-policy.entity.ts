import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VillaPolicyPivot } from './villa-policy-pivot.entity';

export enum VillaPolicyType {
  HouseRules = 'house rules',
  PaymentTerms = 'payment terms',
}

@Entity({ name: 'villa_policies' })
export class VillaPolicy {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: VillaPolicyType })
  type!: VillaPolicyType;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ nullable: true })
  icon!: string | null;

  @OneToMany(
    () => VillaPolicyPivot,
    (villaPolicyPivot) => villaPolicyPivot.policy,
  )
  villaPolicies!: VillaPolicyPivot[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt!: Date | null;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    select: false,
  })
  deletedAt!: Date | null;
}
