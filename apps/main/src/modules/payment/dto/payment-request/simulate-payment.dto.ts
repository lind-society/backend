import { IsNumber, IsOptional } from 'class-validator';

export interface ICreateSimulatePaymentDto {
  amount: number;
}

export interface ISimulatePaymentDto {
  status: string;
  message: string;
}

export class CreateSimulatePaymentDto implements ICreateSimulatePaymentDto {
  @IsOptional()
  @IsNumber()
  amount: number;
}

export class SimulatePaymentDto implements ISimulatePaymentDto {
  status: string;
  message: string;
}
