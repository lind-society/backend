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
import { Additional } from './additional.entity';

@Entity({ name: 'medias' })
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  photo!: string | null;

  @Column({ nullable: true })
  video!: string | null;

  @Column({ name: 'video_360', nullable: true })
  video360!: string | null;

  @Column({ name: 'additional_id', nullable: true })
  additionalId!: string | null;

  @ManyToOne(() => Additional, (additional) => additional.medias, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'additional_id' })
  additional!: Additional;

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
