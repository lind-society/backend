export interface IXenditCardSessionDto {
  message: string;
  payment_request_id: string;
  action_url: string;
}

export class XenditCardSessionDto implements IXenditCardSessionDto {
  message: string;
  payment_request_id: string;
  action_url: string;
}
