export interface IXenditPaymentBaseWebhookDto<Data> {
  event: string;
  businessId: string;
  created: string;
  data: Data;
}

export class XenditPaymentBaseWebhookDto<Data>
  implements IXenditPaymentBaseWebhookDto<Data>
{
  event: string;
  businessId: string;
  created: string;
  data: Data;
}
