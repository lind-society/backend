import { DiscountType as DiscountTypeEnum } from '@apps/main/database/entities';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function ValidateDiscountValue(
  typePropertyName: string,
  pricePropertyName: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validateDiscountValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [typePropertyName, pricePropertyName],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          const typeProperty = args.constraints[0];
          const priceProperty = args.constraints[1];

          // set discount type to percentage if not provided in dto
          const currentDiscountType =
            obj[typeProperty] ?? DiscountTypeEnum.Percentage;

          // If discount is not provided, validation passes
          if (value === null || value === undefined) {
            return true;
          }

          // If discount type is percentage, check range 1-100
          if (currentDiscountType === DiscountTypeEnum.Percentage) {
            return value >= 1 && value <= 100;
          }

          // If discount type is fixed, check it doesn't exceed price
          if (currentDiscountType === DiscountTypeEnum.Fixed) {
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

          // set discount type to percentage if not provided in dto
          const currentDiscountType =
            obj[typeProperty] ?? DiscountTypeEnum.Percentage;

          if (currentDiscountType === DiscountTypeEnum.Percentage) {
            return `For percentage discounts, ${args.property} must be between 1 and 100`;
          }

          if (currentDiscountType === DiscountTypeEnum.Fixed) {
            return `For fixed discounts, ${args.property} must not exceed the ${priceProperty}`;
          }

          return `Invalid ${args.property}`;
        },
      },
    });
  };
}

export function ValidateDiscountValueWithoutPrice(
  typePropertyName: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validateDiscountValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [typePropertyName],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          const typeProperty = args.constraints[0];

          // set discount type to percentage if not provided in dto
          const currentDiscountType =
            obj[typeProperty] ?? DiscountTypeEnum.Percentage;

          // If discount is not provided, validation passes
          if (value === null || value === undefined) {
            return true;
          }

          // If discount type is percentage, check range 1-100
          if (currentDiscountType === DiscountTypeEnum.Percentage) {
            return value >= 1 && value <= 100;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const [typeProperty, priceProperty, DiscountType] = args.constraints;
          const obj = args.object as any;

          // set discount type to percentage if not provided in dto
          const currentDiscountType =
            obj[typeProperty] ?? DiscountTypeEnum.Percentage;

          if (currentDiscountType === DiscountTypeEnum.Percentage) {
            return `For percentage discounts, ${args.property} must be between 1 and 100`;
          }

          if (currentDiscountType === DiscountTypeEnum.Fixed) {
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
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validateDiscountValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [typePropertyName, pricePropertyNames],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          const typeProperty = args.constraints[0];
          const priceProperties = args.constraints[1];

          // set discount type to percentage if not provided in dto
          const currentDiscountType: DiscountTypeEnum =
            obj[typeProperty] ?? DiscountTypeEnum.Percentage;

          if (value === null || value === undefined) {
            return true;
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

          if (currentDiscountType === DiscountTypeEnum.Percentage) {
            return value >= 1 && value <= 100;
          }

          if (currentDiscountType === DiscountTypeEnum.Fixed) {
            return value >= 0 && value <= applicablePrice;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const [typeProperty, priceProperties, DiscountType] =
            args.constraints;
          const obj = args.object as any;

          const currentDiscountType =
            obj[typeProperty] ?? DiscountTypeEnum.Percentage;

          const applicablePrice = priceProperties
            .map((prop: any) => obj[prop])
            .filter((price: number) => price !== null && price !== undefined)
            .reduce(
              (min: number, price: number) =>
                min === null || price < min ? price : min,
              null,
            );

          if (applicablePrice === null) {
            return `Cannot validate ${args.property}: no valid prices found among ${priceProperties.join(', ')}`;
          }

          if (currentDiscountType === DiscountTypeEnum.Percentage) {
            return `For percentage discounts, ${args.property} must be between 1 and 100`;
          }

          if (currentDiscountType === DiscountTypeEnum.Fixed) {
            return `For fixed discounts, ${args.property} must not exceed the lowest price (${applicablePrice}) among: ${priceProperties.join(', ')}`;
          }

          return `Invalid ${args.property}`;
        },
      },
    });
  };
}
