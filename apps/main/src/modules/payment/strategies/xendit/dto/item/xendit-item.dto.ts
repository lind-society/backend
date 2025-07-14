export class IXenditCreateItemRequestDto {
  name: string;
  quantity: string;
  price: number;
  category?: string;
  url?: string;
  [key: string]: any;
}

export class XenditCreateItemRequestDto implements IXenditCreateItemRequestDto {
  name: string;
  quantity: string;
  price: number;
  category?: string;
  url?: string;
  [key: string]: any;
}
