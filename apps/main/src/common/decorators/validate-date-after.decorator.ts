import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * Assert that the decorated date is strictly after another date property.
 *
 * Booking creation previously accepted a checkOutDate earlier than its
 * checkInDate and returned 201, storing a negative-length stay.
 *
 * Only runs when both values are present and parseable; presence itself is
 * still the job of @IsNotEmpty / @IsDate on each property.
 */
export function IsDateAfter(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isDateAfter',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ];

          if (value === undefined || value === null) return true;
          if (relatedValue === undefined || relatedValue === null) return true;

          const current = new Date(value as string | Date).getTime();
          const related = new Date(relatedValue as string | Date).getTime();

          if (Number.isNaN(current) || Number.isNaN(related)) return true;

          return current > related;
        },

        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be after ${relatedPropertyName}`;
        },
      },
    });
  };
}
