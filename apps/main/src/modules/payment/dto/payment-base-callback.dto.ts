import { IsOptional, IsString } from 'class-validator';

export interface IPaymentBaseCallbackDto<Data> {
  event: string;
  businessId: string;
  created: string;
  apiVersion: string;
  data: Data;
}

export class PaymentBaseCallbackDto<Data>
  implements IPaymentBaseCallbackDto<Data>
{
  @IsString()
  @IsOptional()
  event: string;

  @IsString()
  @IsOptional()
  businessId: string;

  @IsString()
  @IsOptional()
  created: string;

  @IsString()
  @IsOptional()
  apiVersion: string;

  @IsOptional()
  data: Data;
}
