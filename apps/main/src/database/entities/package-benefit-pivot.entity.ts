import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { PackageBenefit } from './package-benefit.entity';
import { Package } from './package.entity';

@Entity({ name: 'package_benefit_pivot' })
@Unique(['packageId', 'benefitId'])
export class PackageBenefitPivot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'package_id', type: 'uuid' })
  packageId!: string;

  @Column({ name: 'benefit_id', type: 'uuid' })
  benefitId!: string;

  @ManyToOne(() => Package, (pkg) => pkg.packageBenefits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'package_id' })
  package!: Package;

  @ManyToOne(() => PackageBenefit, (benefit) => benefit.packageBenefits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'benefit_id' })
  benefit!: PackageBenefit;

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
