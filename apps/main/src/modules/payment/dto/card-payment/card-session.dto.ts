export interface ICardSessionDto {
  message: string;
  paymentRequestId: string;
  actionUrl: string;
}

export class CardSessionDto implements ICardSessionDto {
  message: string;
  paymentRequestId: string;
  actionUrl: string;
}
