import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function PhoneNumberValidator(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'phoneNumberValidator',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue: string = (args.object as any)[
            relatedPropertyName
          ];

          if (!relatedValue || !value) {
            return true; // skip if one is empty, let other validators handle
          }

          const numericCountryCode = relatedValue.replace('+', '');

          return !value.startsWith(numericCountryCode);
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedPropertyValue = (args.object as any)[
            relatedPropertyName
          ];
          return `${args.property} must not start with the country code (${relatedPropertyValue}) from ${relatedPropertyName}`;
        },
      },
    });
  };
}
