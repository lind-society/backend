export interface IXenditCreateCardSessionDto {
  card_number: string;
  cardholder_first_name: string;
  cardholder_last_ame: string;
  cardholder_email: string;
  cardholder_phone_number: string;
  expiry_month: number;
  expiry_year: number;
  cvn: string;
  save_card_paymentToken: boolean;
  payment_session_id: string;
}

export class XenditCreateCardSessionDto implements IXenditCreateCardSessionDto {
  card_number: string;
  cardholder_first_name: string;
  cardholder_last_ame: string;
  cardholder_email: string;
  cardholder_phone_number: string;
  expiry_month: number;
  expiry_year: number;
  cvn: string;
  save_card_paymentToken: boolean;
  payment_session_id: string;
}
