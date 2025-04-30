import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Icon } from './shared-interface.entity';
import { VillaPolicyPivot } from './villa-policy-pivot.entity';
import { VillaPolicyType } from './villa-policy-type.entity';

@Entity({ name: 'villa_policies' })
export class VillaPolicy {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ name: 'type_id', type: 'uuid' })
  typeId!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  icon!: Icon | null;

  @OneToMany(
    () => VillaPolicyPivot,
    (villaPolicyPivot) => villaPolicyPivot.policy,
  )
  villaPolicies!: VillaPolicyPivot[];

  @ManyToOne(() => VillaPolicyType, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'type_id' })
  type!: VillaPolicyType;

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
