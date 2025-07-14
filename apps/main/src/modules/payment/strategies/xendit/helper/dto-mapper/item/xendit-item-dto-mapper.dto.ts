import { CreatePaymentItemRequestDto } from '@apps/main/modules/payment/dto/item';
import { XenditCreateItemRequestDto } from '../../../dto';

export function mapXenditToGenericCreateItemRequestDto(
  payload: XenditCreateItemRequestDto,
): CreatePaymentItemRequestDto {
  return {
    name: payload.name,
    quantity: payload.quantity,
    price: payload.price,
    category: payload.category,
    url: payload.url,
  };
}
