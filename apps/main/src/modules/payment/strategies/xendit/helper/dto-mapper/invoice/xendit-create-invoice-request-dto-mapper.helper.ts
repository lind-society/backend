import { CreateInvoiceRequestDto } from '@apps/main/modules/payment/dto';
import { XenditCreateInvoiceRequestDto } from '../../../dto/invoice';

export function mapGenericToXenditCreateInvoiceRequestDto(
  payload: CreateInvoiceRequestDto,
): XenditCreateInvoiceRequestDto {
  return {
    external_id: payload.externalId,
    amount: payload.amount,
    currency: payload.currency,
    description: payload.description,
    invoice_duration: payload.invoiceDuration,
    customer: {
      email: payload.customer.email,
      given_names: payload.customer.givenName,
      surname: payload.customer.mobileNumber,
      mobile_number: payload.customer.mobileNumber,
      addresses: payload.customer.address
        ? [{ address: payload.customer.address }]
        : [],
    },
    items: payload.items?.map((item) => ({
      ...item,
      quantity: String(item.quantity),
    })),
    success_redirect_url: `${payload.successRedirectUrl}/${payload.externalId.split('_')[0]}`,
    failure_redirect_url: `${payload.failureRedirectUrl}/${payload.externalId.split('_')[0]}`,
    metadata: payload.metadata,
  };
}
