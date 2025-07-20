import { IsOptional, IsString } from 'class-validator';

export interface IRecurringConfigurationDto {
  recurringExpiry?: string;
  recurringFrequency?: number;
}

export class RecurringConfigurationDto implements IRecurringConfigurationDto {
  @IsString()
  @IsOptional()
  recurringExpiry?: string;

  @IsString()
  @IsOptional()
  recurringFrequency?: number;
}
