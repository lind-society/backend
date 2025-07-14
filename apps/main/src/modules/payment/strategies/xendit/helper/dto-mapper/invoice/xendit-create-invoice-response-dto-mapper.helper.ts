import { CreateInvoiceResponseDto } from '@apps/main/modules/payment/dto';
import { XenditCreateInvoiceResponseDto } from '../../../dto/invoice';
import { mapXenditToGenericPaymentStatus } from '../../enum-mapper';
import { mapXenditToGenericCustomerDto } from '../customer/xendit-create-customer-dto-mapper.dto';
import { mapXenditToGenericCreateItemRequestDto } from '../item/xendit-item-dto-mapper.dto';
import {
  mapXenditToGenericCreateInvoiceFeeRequestDto,
  mapXenditToGenericInvoicechannelPropertiesDto,
  mapXenditToGenericInvoiceCustomerNotificationPreferenceDto,
} from './xendit-invoice-related-field-dto-mapper.helper';

export function mapXenditToGenericCreateInvoiceResponseDto(
  payload: XenditCreateInvoiceResponseDto,
): CreateInvoiceResponseDto {
  return {
    id: payload.id,
    externalId: payload.external_id,
    amount: payload.amount,
    currency: payload.currency,
    description: payload.description,
    status: mapXenditToGenericPaymentStatus(payload.status),
    invoiceUrl: payload.invoice_url,
    expiryDate: payload.expiry_date,
    customer: mapXenditToGenericCustomerDto(payload.customer),
    customerNotificationPreference:
      mapXenditToGenericInvoiceCustomerNotificationPreferenceDto(
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
    items: payload.items?.map(mapXenditToGenericCreateItemRequestDto),
    fees: payload.fees?.map(mapXenditToGenericCreateInvoiceFeeRequestDto),
    channelProperties: mapXenditToGenericInvoicechannelPropertiesDto(
      payload.channel_properties,
    ),
    metadata: payload.metadata,
    userId: payload.user_id,
    payerEmail: payload.payer_email,
  };
}
