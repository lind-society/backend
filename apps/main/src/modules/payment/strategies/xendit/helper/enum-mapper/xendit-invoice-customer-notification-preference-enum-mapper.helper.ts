import { InvoiceCustomerNotificationPreference } from '@apps/main/modules/payment/enum';
import { InternalServerErrorException } from '@nestjs/common';
import { XenditInvoiceCustomerNotificationPreference } from '../../enum';

export function mapXenditToGenericInvoiceCustomerNotificationPreference(
  preference: XenditInvoiceCustomerNotificationPreference,
): InvoiceCustomerNotificationPreference {
  switch (preference) {
    case XenditInvoiceCustomerNotificationPreference.Email:
      return InvoiceCustomerNotificationPreference.Email;
    case XenditInvoiceCustomerNotificationPreference.Fiber:
      return InvoiceCustomerNotificationPreference.Fiber;
    case XenditInvoiceCustomerNotificationPreference.Whatsapp:
      return InvoiceCustomerNotificationPreference.Whatsapp;
    default:
      throw new InternalServerErrorException(
        `invalid xendit invoice customer notification preference : ${preference}`,
      );
  }
}

export function mapGenericToXenditInvoiceCustomerNotificationPreference(
  preference: InvoiceCustomerNotificationPreference,
): XenditInvoiceCustomerNotificationPreference {
  switch (preference) {
    case InvoiceCustomerNotificationPreference.Email:
      return XenditInvoiceCustomerNotificationPreference.Email;
    case InvoiceCustomerNotificationPreference.Fiber:
      return XenditInvoiceCustomerNotificationPreference.Fiber;
    case InvoiceCustomerNotificationPreference.Whatsapp:
      return XenditInvoiceCustomerNotificationPreference.Whatsapp;
    default:
      throw new InternalServerErrorException(
        `invalid invoice customer notification preference`,
      );
  }
}
