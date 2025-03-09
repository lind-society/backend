import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PropertyAdditionalPivot } from './property-additional-pivot.entity';

export enum AdditionalType {
  Bedrooms = 'bedrooms',
  IndoorAreas = 'indoor areas',
  OutdoorAreas = 'outdoor areas',
  MorePictures = 'more pictures',
}

@Entity({ name: 'additionals' })
export class Additional {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: AdditionalType })
  type!: AdditionalType;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', array: true, nullable: true })
  photos!: string[] | null;

  @OneToMany(
    () => PropertyAdditionalPivot,
    (propertyAdditionalPivot) => propertyAdditionalPivot.additional,
  )
  propertyAdditionals!: PropertyAdditionalPivot[];

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
