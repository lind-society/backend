export interface ICreateCardSessionDto {
  cardNumber: string;
  cardHolderFirstName: string;
  cardHolderLastName: string;
  cardHolderEmail: string;
  cardHolderPhoneNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvn: string;
  saveCardPaymentToken: boolean;
  paymentSessionId: string;
}

export class CreateCardSessionDto implements ICreateCardSessionDto {
  cardNumber: string;
  cardHolderFirstName: string;
  cardHolderLastName: string;
  cardHolderEmail: string;
  cardHolderPhoneNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvn: string;
  saveCardPaymentToken: boolean;
  paymentSessionId: string;
}
