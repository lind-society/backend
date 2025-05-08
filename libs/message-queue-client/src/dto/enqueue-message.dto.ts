import { MessageQueueType } from '@apps/main/database/entities';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class EnqueueMessageDto {
  @IsEnum(MessageQueueType, {
    message: `message queue type must be one of: ${Object.values(MessageQueueType).join(', ')}`,
  })
  @IsNotEmpty()
  type!: MessageQueueType;

  @IsString()
  @IsNotEmpty()
  recipient!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  scheduledAt?: Date;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
