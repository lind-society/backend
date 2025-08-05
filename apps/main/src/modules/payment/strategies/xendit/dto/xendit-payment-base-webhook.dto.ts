import { IsOptional, IsString } from 'class-validator';

export interface IXenditPaymentBaseCallbackDto<Data> {
  event: string;
  business_id: string;
  created: string;
  data: Data;
}

export class XenditPaymentBaseCallbackDto<Data>
  implements IXenditPaymentBaseCallbackDto<Data>
{
  @IsString()
  @IsOptional()
  event: string;

  @IsString()
  @IsOptional()
  business_id: string;

  @IsString()
  @IsOptional()
  created: string;

  @IsOptional()
  data: Data;

  @IsString()
  @IsOptional()
  api_version?: string;
}
