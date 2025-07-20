import { PaymentItemDto } from '@apps/main/modules/payment/dto/item';
import { PaymentAvailableItemType } from '@apps/main/modules/payment/enum';
import { XenditPaymentItemDto } from '../../../dto';

export function mapXenditToGenericPaymentItemsDto(
  payload: XenditPaymentItemDto[],
): PaymentItemDto[] {
  if (!payload || !payload.length) {
    return
  }
  
  return payload.map((item) => ({
    ...item,
    type: PaymentAvailableItemType.PhysicalProduct, // to do : adjust
    name: item.name,
    quantity: item.quantity,
    netUnitAmount: item.price,
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
    return
  }

  return payload.map((item) => ({
    ...item,
    type: PaymentAvailableItemType.PhysicalProduct, // to do : adjust
    name: item.name,
    quantity: item.quantity,
    price: item.netUnitAmount,
    category: item.category,
    url: item.url,
    image_url: item?.imageUrl,
    sub_category: item?.subCategory,
    description: item?.description,
    metadata: item?.metadata,
  }));
}
