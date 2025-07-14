export interface IXenditCreatePaymentRequestCardDto {
  reference_id: string;
  type: 'PAY' | string;
  country: string;
  currency: string;
  request_amount: number;
  capture_method: 'AUTOMATIC' | 'MANUAL' | string;
  channel_code: 'CARDS' | string;
  channel_properties: {
    mid_label: string;
    card_details: {
      cvn: string;
      card_number: string;
      expiry_year: string;
      expiry_month: string;
      cardholder_first_name: string;
      cardholder_last_name: string;
      cardholder_email: string;
      cardholder_phone_number: string;
    };
    skip_three_ds: boolean;
    card_on_file_type?:
      | 'MERCHANT_UNSCHEDULED'
      | 'CUSTOMER_INITIATED'
      | 'UNSCHEDULED'
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
      recurring_expiry: string; // "YYYY-MM-DD"
      recurring_frequency: number; // in days
    };
  };
  description?: string;
  metadata?: Record<string, any>;
}

export class XenditCreatePaymentRequestCardDto
  implements IXenditCreatePaymentRequestCardDto
{
  reference_id: string;
  type: 'PAY' | string;
  country: string;
  currency: string;
  request_amount: number;
  capture_method: 'AUTOMATIC' | 'MANUAL' | string;
  channel_code: 'CARDS' | string;
  channel_properties: {
    mid_label: string;
    card_details: {
      cvn: string;
      card_number: string;
      expiry_year: string;
      expiry_month: string;
      cardholder_first_name: string;
      cardholder_last_name: string;
      cardholder_email: string;
      cardholder_phone_number: string;
    };
    skip_three_ds: boolean;
    card_on_file_type?:
      | 'MERCHANT_UNSCHEDULED'
      | 'CUSTOMER_INITIATED'
      | 'UNSCHEDULED'
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
      recurring_expiry: string; // "YYYY-MM-DD"
      recurring_frequency: number; // in days
    };
  };
  description?: string;
  metadata?: Record<string, any>;
}
