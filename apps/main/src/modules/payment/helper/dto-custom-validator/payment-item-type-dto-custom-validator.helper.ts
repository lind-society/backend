import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PaymentItemDto } from '../../dto/item';
import { PaymentAvailableItemType } from '../../enum';
import { PAYMENT_ITEM_NET_UNIT_AMOUNT_VALIDATOR } from './payment-dto-custom-validator-constant.helper';

@ValidatorConstraint({
  name: PAYMENT_ITEM_NET_UNIT_AMOUNT_VALIDATOR,
  async: false,
})
export class PaymentItemNetUnitAmountValidator
  implements ValidatorConstraintInterface
{
  validate(value: number, args: ValidationArguments): boolean {
    const obj = args.object as PaymentItemDto;
    const type = obj.type as PaymentAvailableItemType;

    if (type == null || type == undefined) {
      return true;
    }

    if (value == null || value == undefined) {
      return false;
    }

    if (type === PaymentAvailableItemType.Discount) {
      return value < 0;
    } else {
      return value >= 0;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const obj = args.object as PaymentItemDto;
    const type = obj.type as PaymentAvailableItemType;

    if (type === PaymentAvailableItemType.Discount) {
      return `if payment item type : ${PaymentAvailableItemType.Discount}, item net unit amount must be a negative number (less than 0)`;
    } else {
      return `if payment item type is not : ${PaymentAvailableItemType.Discount}, item net unit amount must be a positive number (more or equal to 0)`;
    }
  }
}
