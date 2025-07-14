export class IXenditCreatePaymentResponseCardDto {
  business_id: string;
  reference_id: string;
  payment_request_id: string;
  type: 'PAY' | string;
  country: string;
  currency: string;
  request_amount: number;
  capture_method: 'AUTOMATIC' | 'MANUAL' | string;
  channel_code: 'CARDS' | string;
  channel_properties: {
    mid_label: string;
    card_details: {
      masked_card_number: string;
      cardholder_first_name: string;
      cardholder_last_name: string;
      cardholder_email: string;
      cardholder_phone_number: string;
      expiry_month: string;
      expiry_year: string;
      fingerprint: string;
      type: 'CREDIT' | 'DEBIT' | string;
      network: string;
      country: string;
      issuer: string;
    };
    skip_three_ds: boolean;
    card_on_file_type?:
      | 'CUSTOMER_UNSCHEDULED'
      | 'MERCHANT_UNSCHEDULED'
      | string;
    failure_return_url?: string;
    success_return_url?: string;
    billing_information?: {
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      city: string;
      country: string;
      postal_code: string;
      street_line1: string;
      street_line2?: string;
      province_state?: string;
    };
    statement_descriptor?: string;
    recurring_configuration?: {
      recurring_expiry: string; // format: YYYY-MM-DD
      recurring_frequency: number; // in days
    };
  };
  actions?: {
    type: 'REDIRECT_CUSTOMER' | string;
    value: string;
    descriptor?: string;
  }[];
  status: 'REQUIRES_ACTION' | 'SUCCEEDED' | 'FAILED' | string;
  description?: string;
  metadata?: Record<string, any>;
  created: string; // ISO 8601 timestamp
  updated: string; // ISO 8601 timestamp
}

export class XenditCreatePaymentResponseCardDto
  implements IXenditCreatePaymentResponseCardDto
{
  business_id: string;
  reference_id: string;
  payment_request_id: string;
  type: 'PAY' | string;
  country: string;
  currency: string;
  request_amount: number;
  capture_method: 'AUTOMATIC' | 'MANUAL' | string;
  channel_code: 'CARDS' | string;
  channel_properties: {
    mid_label: string;
    card_details: {
      masked_card_number: string;
      cardholder_first_name: string;
      cardholder_last_name: string;
      cardholder_email: string;
      cardholder_phone_number: string;
      expiry_month: string;
      expiry_year: string;
      fingerprint: string;
      type: 'CREDIT' | 'DEBIT' | string;
      network: string;
      country: string;
      issuer: string;
    };
    skip_three_ds: boolean;
    card_on_file_type?:
      | 'CUSTOMER_UNSCHEDULED'
      | 'MERCHANT_UNSCHEDULED'
      | string;
    failure_return_url?: string;
    success_return_url?: string;
    billing_information?: {
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      city: string;
      country: string;
      postal_code: string;
      street_line1: string;
      street_line2?: string;
      province_state?: string;
    };
    statement_descriptor?: string;
    recurring_configuration?: {
      recurring_expiry: string; // format: YYYY-MM-DD
      recurring_frequency: number; // in days
    };
  };
  actions?: {
    type: 'REDIRECT_CUSTOMER' | string;
    value: string;
    descriptor?: string;
  }[];
  status: 'REQUIRES_ACTION' | 'SUCCEEDED' | 'FAILED' | string;
  description?: string;
  metadata?: Record<string, any>;
  created: string; // ISO 8601 timestamp
  updated: string; // ISO 8601 timestamp
}
