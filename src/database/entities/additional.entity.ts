import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Media } from './media.entity';
import { PropertyAdditionalPivot } from './property-additional-pivot.entity';

export enum AdditionalType {
  Bedrooms = 'bedrooms',
  IndoorArea = 'indoor area',
  OutdoorArea = 'outdoor area',
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

  @OneToMany(() => Media, (media) => media.additional, { cascade: true })
  media!: Media[];

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
