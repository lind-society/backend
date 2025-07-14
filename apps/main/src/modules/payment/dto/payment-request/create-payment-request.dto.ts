export interface ICreatePaymentRequestDto {
  reference_id: string;
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
  description?: string;
  metadata?: Record<string, any>;
  items?: Record<string, any>[];
  shipping_information?: Record<string, any>;
}

export class CreatePaymentRequestDto implements ICreatePaymentRequestDto {
  reference_id: string;
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
  description?: string;
  metadata?: Record<string, any>;
  items?: Record<string, any>[];
  shipping_information?: Record<string, any>;
}
