import { PaymentAvailableCustomerNotificationPreference } from '@apps/main/modules/payment/enum';
import { InternalServerErrorException } from '@nestjs/common';
import { XenditPaymentAvailableCustomerNotificationPreference } from '../../enum';

export function mapXenditToGenericPaymentAvailableCustomerNotificationPreference(
  preference: XenditPaymentAvailableCustomerNotificationPreference,
): PaymentAvailableCustomerNotificationPreference {
  switch (preference) {
    case XenditPaymentAvailableCustomerNotificationPreference.Email:
      return PaymentAvailableCustomerNotificationPreference.Email;
    case XenditPaymentAvailableCustomerNotificationPreference.Fiber:
      return PaymentAvailableCustomerNotificationPreference.Fiber;
    case XenditPaymentAvailableCustomerNotificationPreference.Whatsapp:
      return PaymentAvailableCustomerNotificationPreference.Whatsapp;
    default:
      throw new InternalServerErrorException(
        `invalid xendit invoice customer notification preference : ${preference}`,
      );
  }
}

export function mapGenericToXenditPaymentAvailableCustomerNotificationPreference(
  preference: PaymentAvailableCustomerNotificationPreference,
): XenditPaymentAvailableCustomerNotificationPreference {
  switch (preference) {
    case PaymentAvailableCustomerNotificationPreference.Email:
      return XenditPaymentAvailableCustomerNotificationPreference.Email;
    case PaymentAvailableCustomerNotificationPreference.Fiber:
      return XenditPaymentAvailableCustomerNotificationPreference.Fiber;
    case PaymentAvailableCustomerNotificationPreference.Whatsapp:
      return XenditPaymentAvailableCustomerNotificationPreference.Whatsapp;
    default:
      throw new InternalServerErrorException(
        `invalid invoice customer notification preference`,
      );
  }
}
