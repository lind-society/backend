export class IXenditPaymentItemDto {
  name: string;
  quantity: number;
  price: number;
  category?: string;
  url?: string;
  [key: string]: any;
}

export class XenditPaymentItemDto implements IXenditPaymentItemDto {
  name: string;
  quantity: number;
  price: number;
  category?: string;
  url?: string;
  [key: string]: any;
}
