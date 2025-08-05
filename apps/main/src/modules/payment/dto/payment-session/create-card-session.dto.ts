import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export interface ICreateCardSessionDto {
  cardNumber: string;
  cardHolderFirstName: string;
  cardHolderLastName: string;
  cardHolderEmail: string;
  cardHolderPhoneNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvn: string;
  saveCardPaymentToken?: boolean;
  paymentSessionId?: string;
}

export class CreateCardSessionDto implements ICreateCardSessionDto {
  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  cardHolderFirstName: string;

  @IsString()
  @IsNotEmpty()
  cardHolderLastName: string;

  @IsString()
  @IsNotEmpty()
  cardHolderEmail: string;

  @IsString()
  @IsNotEmpty()
  cardHolderPhoneNumber: string;

  @IsString()
  @IsNotEmpty()
  expiryMonth: number;

  @IsString()
  @IsNotEmpty()
  expiryYear: number;

  @IsString()
  @IsNotEmpty()
  cvn: string;

  @IsBoolean()
  @IsOptional()
  saveCardPaymentToken: boolean;

  @IsBoolean()
  @IsOptional()
  paymentSessionId: string;
}
