import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PackageBenefitPivot } from './package-benefit-pivot.entity';

@Entity({ name: 'packages' })
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string | null;

  /** Shown on the public "manage your property" pricing page, e.g. 8.00 = "8% of rental revenue". */
  @Column({
    name: 'commission_percentage',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  commissionPercentage!: number | null;

  @OneToMany(
    () => PackageBenefitPivot,
    (packageBenefitPivot) => packageBenefitPivot.package,
  )
  packageBenefits!: PackageBenefitPivot[];

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
