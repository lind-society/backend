export class ICreatePaymentItemRequestDto {
  name: string;
  quantity: string;
  price: number;
  category?: string;
  url?: string;
  [key: string]: any;
}

export class CreatePaymentItemRequestDto
  implements ICreatePaymentItemRequestDto
{
  name: string;
  quantity: string;
  price: number;
  category?: string;
  url?: string;
  [key: string]: any;
}
