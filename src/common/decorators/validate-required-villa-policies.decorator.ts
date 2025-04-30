import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function ValidateRequiredVillaPolicies(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'hasRequiredPolicies',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(policies: any[], args: ValidationArguments) {
          if (!Array.isArray(policies)) return false;

          const requiredNames = [
            'check in rules',
            'check out rules',
            'late check out rules',
          ];

          const lowerCaseNames = policies.map((p) =>
            typeof p.name === 'string' ? p.name.toLowerCase() : '',
          );

          return requiredNames.every((required) =>
            lowerCaseNames.includes(required),
          );
        },

        defaultMessage(args: ValidationArguments) {
          return `policies must include house rule of : "check in rules", "check out rules", and "late check out rules"`;
        },
      },
    });
  };
}
