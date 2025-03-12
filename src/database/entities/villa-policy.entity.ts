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

@Entity({ name: 'villa_policies' })
export class VillaPolicy {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  icon!: string | null;

  @Column({ type: 'varchar', array: true, nullable: true })
  list!: string[] | null;

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
