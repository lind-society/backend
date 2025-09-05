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
import { VillaAdditionalPivot } from './villa-additional-pivot.entity';

export enum AdditionalType {
  Bedrooms = 'bedrooms',
  IndoorAreas = 'indoor_areas',
  OutdoorAreas = 'outdoor_areas',
  MorePictures = 'more_pictures',
}

@Entity({ name: 'additionals' })
export class Additional {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: AdditionalType })
  type!: AdditionalType;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', array: true, nullable: true })
  photos!: string[] | null;

  @OneToMany(
    () => PropertyAdditionalPivot,
    (propertyAdditionalPivot) => propertyAdditionalPivot.additional,
  )
  propertyAdditionals!: PropertyAdditionalPivot[];

  @OneToMany(
    () => VillaAdditionalPivot,
    (villaAdditionalPivot) => villaAdditionalPivot.additional,
  )
  villaAdditionals!: VillaAdditionalPivot[];

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
