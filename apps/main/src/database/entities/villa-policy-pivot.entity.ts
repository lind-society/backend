import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VillaPolicy } from './villa-policy.entity';
import { Villa } from './villa.entity';

@Entity({ name: 'villa_policy_pivot' })
export class VillaPolicyPivot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'villa_id', type: 'uuid' })
  villaId!: string;

  @Column({ name: 'policy_id', type: 'uuid' })
  policyId!: string;

  @ManyToOne(() => Villa, (villa) => villa.villaPolicies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'villa_id' })
  villa!: Villa;

  @ManyToOne(() => VillaPolicy, (policy) => policy.villaPolicies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'policy_id' })
  policy!: VillaPolicy;

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
