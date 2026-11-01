import {
  Inquiry,
  InquiryStatus,
  InquiryType,
} from '@apps/main/database/entities';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

export class InquiryDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly type!: InquiryType;

  @Expose()
  readonly status!: InquiryStatus;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly email!: string;

  @Expose()
  readonly phone!: string | null;

  @Expose()
  readonly message!: string | null;

  @Expose()
  readonly referenceId!: string | null;

  @Expose()
  readonly referenceName!: string | null;

  @Expose()
  readonly metadata!: Record<string, unknown> | null;

  @Expose()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: Inquiry): InquiryDto {
    return plainToInstance(InquiryDto, entity);
  }

  static fromEntities(entities: Inquiry[]): InquiryDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
