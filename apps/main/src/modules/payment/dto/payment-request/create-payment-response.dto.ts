export interface ICreatePaymentResponseDto {
  business_id: string;
  reference_id: string;
  payment_request_id: string;
  type: string;
  country: string;
  currency: string;
  request_amount: number;
  capture_method: string;
  channel_code: string;
  channel_properties: {
    failure_return_url: string;
    success_return_url: string;
  };
  actions: [
    {
      type: string;
      value: string;
      descriptor: string;
    },
  ];
  status: string;
  description: string;
  metadata: Record<string, any>;
  created: string;
  updated: string;
}

export class CreatePaymentResponseDto implements ICreatePaymentResponseDto {
  business_id: string;
  reference_id: string;
  payment_request_id: string;
  type: string;
  country: string;
  currency: string;
  request_amount: number;
  capture_method: string;
  channel_code: string;
  channel_properties: {
    failure_return_url: string;
    success_return_url: string;
  };
  actions: [
    {
      type: string;
      value: string;
      descriptor: string;
    },
  ];
  status: string;
  description: string;
  metadata: Record<string, any>;
  created: string;
  updated: string;
}
