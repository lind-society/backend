import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Villa } from './villa.entity';

/**
 * A single calendar day for one villa.
 *
 * This is the top layer of the nightly-rate resolution, above the season price
 * rules and the villa's own tier columns:
 *
 *   daily override  ->  price rule season  ->  villa season tier  ->  dailyPrice
 *
 * A row only has to carry the fields that actually differ from the defaults, so
 * a day that just needs a longer minimum stay leaves `price` null and keeps
 * whatever the season would have charged.
 */
@Entity({ name: 'villa_daily_rates' })
@Unique('uq_villa_daily_rate_villa_date', ['villaId', 'date'])
@Index('idx_villa_daily_rate_villa_date', ['villaId', 'date'])
export class VillaDailyRate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'villa_id', type: 'uuid' })
  villaId!: string;

  /**
   * Calendar day, not an instant. Stored as `date` so a night is the same
   * night regardless of the server's timezone — a `timestamptz` here would
   * shift days for anyone east or west of the server.
   */
  @Column({ name: 'date', type: 'date' })
  date!: string;

  /** Overrides the nightly rate for this date. Null = fall through to season. */
  @Column({
    name: 'price',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  price!: number | null;

  /** Minimum nights a stay *starting* on this date must run for. */
  @Column({ name: 'min_stay', type: 'smallint', nullable: true })
  minStay!: number | null;

  /** Closed for booking — maintenance, owner's own use, or an external booking. */
  @Column({ name: 'is_blocked', type: 'boolean', default: false })
  isBlocked!: boolean;

  /** Free-text reason shown to admins in the calendar, never to guests. */
  @Column({ name: 'note', type: 'text', nullable: true })
  note!: string | null;

  @ManyToOne(() => Villa, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'villa_id' })
  villa!: Villa;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
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
