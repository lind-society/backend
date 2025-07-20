import { CreatePaymentInvoiceDto } from '@apps/main/modules/payment/dto';
import { XenditCreatePaymentInvoiceDto } from '../../../dto/invoice';

export function mapGenericToXenditCreatePaymentInvoiceDto(
  payload: CreatePaymentInvoiceDto,
): XenditCreatePaymentInvoiceDto {
  return {
    external_id: payload.externalId,
    amount: payload.amount,
    currency: payload.currency,
    description: payload.description,
    invoice_duration: payload.invoiceDuration,
    customer: null,
    items: payload.items?.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.netUnitAmount,
      category: item.category,
      url: item.url,
      ...item,
    })),
    success_redirect_url: `${payload.successRedirectUrl}/${payload.externalId.split('_')[0]}`,
    failure_redirect_url: `${payload.failureRedirectUrl}/${payload.externalId.split('_')[0]}`,
    metadata: payload.metadata,
  };
}
