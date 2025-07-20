export interface IPaymentBaseWebhookDto<Data> {
  event: string;
  businessId: string;
  created: string;
  data: Data;
}

export class PaymentBaseWebhookDto<Data>
  implements IPaymentBaseWebhookDto<Data>
{
  event: string;
  businessId: string;
  created: string;
  data: Data;
}
