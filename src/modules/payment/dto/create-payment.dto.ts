import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  invoiceDuration: string;

  @IsString()
  externalId: string;

  @IsString()
  description: string;

  @IsString()
  currency: string;

  @IsNumber()
  reminderTime: number;
}
