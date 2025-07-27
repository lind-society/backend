import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreatePaymentInvoiceDto } from '../../dto';
import { PaymentAvailableReminderTimeUnit } from '../../enum';
import { PAYMENT_INVOICE_REMINDER_TIME_VALIDATOR } from './payment-dto-custom-validator-constant.helper';

@ValidatorConstraint({
  name: PAYMENT_INVOICE_REMINDER_TIME_VALIDATOR,
  async: false,
})
export class InvoiceReminderTimeValidator
  implements ValidatorConstraintInterface
{
  validate(value: number, args: ValidationArguments): boolean {
    const obj = args.object as CreatePaymentInvoiceDto;
    const unit = obj.reminderTimeUnit as PaymentAvailableReminderTimeUnit;

    if (value == null || value == undefined) {
      return true;
    }

    switch (unit) {
      case PaymentAvailableReminderTimeUnit.Days:
        return value >= 1 && value <= 30;
      case PaymentAvailableReminderTimeUnit.Hours:
        return value >= 1 && value <= 24;
      default:
        return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const obj = args.object as CreatePaymentInvoiceDto;
    const unit = obj.reminderTimeUnit as PaymentAvailableReminderTimeUnit;

    switch (unit) {
      case PaymentAvailableReminderTimeUnit.Days:
        return `reminder time must be between 1 and 30 for ${PaymentAvailableReminderTimeUnit.Days}`;
      case PaymentAvailableReminderTimeUnit.Hours:
        return `reminder time must be between 1 and 24 for ${PaymentAvailableReminderTimeUnit.Hours}`;
      default:
        return 'invalid reminder time value';
    }
  }
}
