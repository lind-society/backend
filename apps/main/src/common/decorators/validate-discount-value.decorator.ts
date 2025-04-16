import { DiscountType } from '@apps/main/database/entities';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function ValidateDiscountValue(
  typePropertyName: string,
  pricePropertyName: string,
  discountEnum: typeof DiscountType,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validateDiscountValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [typePropertyName, pricePropertyName, discountEnum],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          const typeProperty = args.constraints[0];
          const priceProperty = args.constraints[1];
          const DiscountType = args.constraints[2];

          // If discount is not provided, validation passes
          if (value === null || value === undefined) {
            return true;
          }

          // If discount type is not provided, discount should not be provided (deprecated, currently discount will dynamically filled as percentage if disocunt is provided)
          // if (obj[typeProperty] === null || obj[typeProperty] === undefined) {
          //   return false;
          // }

          // If discount type is percentage, check range 1-100
          if (obj[typeProperty] === DiscountType.Percentage) {
            return value >= 1 && value <= 100;
          }

          // If discount type is fixed, check it doesn't exceed price
          if (obj[typeProperty] === DiscountType.Fixed) {
            // If price is not provided, we can't validate against it
            if (
              obj[priceProperty] === null ||
              obj[priceProperty] === undefined
            ) {
              return true;
            }
            return value >= 0 && value <= obj[priceProperty];
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const [typeProperty, priceProperty, DiscountType] = args.constraints;
          const obj = args.object as any;

          // (deprecate)
          // if (obj[typeProperty] === null || obj[typeProperty] === undefined) {
          //   return `${args.property} cannot be set when ${typeProperty} is not provided`;
          // }

          if (obj[typeProperty] === DiscountType.Percentage) {
            return `For percentage discounts, ${args.property} must be between 1 and 100`;
          }

          if (obj[typeProperty] === DiscountType.Fixed) {
            return `For fixed discounts, ${args.property} must not exceed the ${priceProperty}`;
          }

          return `Invalid ${args.property}`;
        },
      },
    });
  };
}

export function ValidateDiscountValueFromMultiplePrice(
  typePropertyName: string,
  pricePropertyNames: string[],
  discountEnum: typeof DiscountType,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validateDiscountValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [typePropertyName, pricePropertyNames, discountEnum],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          const typeProperty = args.constraints[0];
          const priceProperties = args.constraints[1];
          const DiscountType = args.constraints[2];

          if (value === null || value === undefined) {
            return true;
          }

          if (obj[typeProperty] === null || obj[typeProperty] === undefined) {
            return false;
          }

          // Find the lowest valid price
          const applicablePrice = priceProperties
            .map((prop: any) => obj[prop])
            .filter((price: number) => price !== null && price !== undefined) // Filter out null/undefined values
            .reduce(
              (min: number, price: number) =>
                min === null || price < min ? price : min,
              null,
            ); // Get the lowest price

          if (applicablePrice === null) {
            return false; // No valid price available
          }

          if (obj[typeProperty] === DiscountType.PERCENTAGE) {
            return value >= 1 && value <= 100;
          }

          if (obj[typeProperty] === DiscountType.FIXED) {
            return value >= 0 && value <= applicablePrice;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const [typeProperty, priceProperties] = args.constraints;
          const obj = args.object as any;

          if (obj[typeProperty] === null || obj[typeProperty] === undefined) {
            return `${args.property} cannot be set when ${typeProperty} is not provided`;
          }

          return `Invalid ${args.property} based on the lowest price among: ${priceProperties.join(
            ', ',
          )}`;
        },
      },
    });
  };
}
