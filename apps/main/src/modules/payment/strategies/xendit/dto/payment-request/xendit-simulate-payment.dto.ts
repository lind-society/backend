export interface IXenditCreateSimulatePaymentDto {
  amount: number;
}

export interface IXenditSimulatePaymentDto {
  status: string;
  message: string;
}

export class XenditCreateSimulatePaymentDto
  implements IXenditCreateSimulatePaymentDto
{
  amount: number;
}

export class XenditSimulatePaymentDto implements IXenditSimulatePaymentDto {
  status: string;
  message: string;
}
