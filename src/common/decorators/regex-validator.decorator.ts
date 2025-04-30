import { applyDecorators, BadRequestException } from '@nestjs/common';
import { Matches } from 'class-validator';
import { regexValidator } from '../constants';

// 👇 this will extract the exact keys of your regexValidator
type RegexValidatorKeys = keyof typeof regexValidator;

export function RegexValidator(field: RegexValidatorKeys) {
  const validator = regexValidator[field];

  if (!validator) {
    throw new BadRequestException(`invalid regexValidator field: "${field}"`);
  }

  return applyDecorators(
    Matches(validator.regex, {
      message: validator.message,
    }),
  );
}
