/**
 * This is a result dto so validation is not needed
 */

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
