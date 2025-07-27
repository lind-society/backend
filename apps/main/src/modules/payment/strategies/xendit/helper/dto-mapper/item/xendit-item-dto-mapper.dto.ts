import { PaymentItemDto } from '@apps/main/modules/payment/dto/item';
import { XenditPaymentItemDto } from '../../../dto';

export function mapXenditToGenericPaymentItemsDto(
  payload: XenditPaymentItemDto[],
): PaymentItemDto[] {
  if (!payload || !payload.length) {
    return;
  }

  return payload.map((item) => ({
    referenceId: item.reference_id,
    currency: item.currency,
    type: item.type,
    name: item.name,
    quantity: item.quantity,
    netUnitAmount: item.net_unit_amount,
    category: item.category,
    url: item.url,
    imageUrl: item?.image_url,
    subCategory: item?.sub_category,
    description: item?.description,
    metadata: item?.metadata,
  }));
}

export function mapGenericToXenditPaymentItemsDto(
  payload: PaymentItemDto[],
): XenditPaymentItemDto[] {
  if (!payload || !payload.length) {
    return;
  }

  return payload.map((item) => ({
    reference_id: item.referenceId,
    currency: item.currency,
    type: item.type,
    name: item.name,
    net_unit_amount: item.netUnitAmount,
    quantity: item.quantity,
    url: item.url,
    image_url: item.imageUrl,
    category: item.category,
    sub_category: item.subCategory,
    description: item.description,
    metadata: item.metadata,
  }));
}
