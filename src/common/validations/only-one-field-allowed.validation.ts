import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'OnlyOneFieldAllowed', async: false })
export class OnlyOneFieldAllowedConstraint
  implements ValidatorConstraintInterface
{
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as Record<string, any>;
    const fields = args.constraints as string[];

    const filledFields = fields.filter(
      (field) => obj[field] !== undefined && obj[field] !== null,
    );

    return filledFields.length <= 1; // Pass only if 0 or 1 fields are set
  }

  defaultMessage(args: ValidationArguments) {
    const fields = args.constraints.join(' or ');
    return `Only one of ${fields} can be provided`;
  }
}