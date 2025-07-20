import { PaymentInvoiceDto } from '@apps/main/modules/payment/dto';
import { XenditPaymentInvoiceDto } from '../../../dto/invoice';
import { mapXenditToGenericPaymentAvailableStatus } from '../../enum-mapper';
import { mapXenditToGenericPaymentCustomerDto } from '../customer/xendit-payment-customer-dto-mapper.dto';
import { mapXenditToGenericPaymentItemsDto } from '../item';
import {
  mapXenditToGenericCreateInvoiceFeeRequestDto,
  mapXenditToGenericInvoicechannelPropertiesDto,
  mapXenditToGenericPaymentAvailableCustomerNotificationPreferenceDto,
} from './xendit-invoice-related-field-dto-mapper.helper';

export function mapXenditToGenericPaymentInvoiceDto(
  payload: XenditPaymentInvoiceDto,
): PaymentInvoiceDto {
  return {
    id: payload.id,
    externalId: payload.external_id,
    amount: payload.amount,
    currency: payload.currency,
    description: payload.description,
    status: mapXenditToGenericPaymentAvailableStatus(payload.status),
    invoiceUrl: payload.invoice_url,
    expiryDate: payload.expiry_date,
    customer: mapXenditToGenericPaymentCustomerDto(payload.customer),
    customerNotificationPreference:
      mapXenditToGenericPaymentAvailableCustomerNotificationPreferenceDto(
        payload.customer_notification_preference,
      ),
    successRedirectUrl: payload.success_redirect_url,
    failureRedirectUrl: payload.failure_redirect_url,
    reminderDate: payload.reminder_date,
    fixedVA: payload.fixed_va,
    midLabel: payload.mid_label,
    shouldAuthenticateCreditCard: payload.should_authenticate_credit_card,
    shouldExcludeCreditCard: payload.should_exclude_credit_card,
    shouldSendEmail: payload.should_send_email,
    createdAt: payload.created,
    updatedAt: payload.updated,
    items: mapXenditToGenericPaymentItemsDto(payload.items),
    fees: mapXenditToGenericCreateInvoiceFeeRequestDto(payload.fees),
    channelProperties: mapXenditToGenericInvoicechannelPropertiesDto(
      payload.channel_properties,
    ),
    metadata: payload.metadata,
    userId: payload.user_id,
    payerEmail: payload.payer_email,
  };
}
