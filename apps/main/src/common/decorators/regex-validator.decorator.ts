import { applyDecorators, BadRequestException } from '@nestjs/common';
import { Matches } from 'class-validator';
import { REGEX_VALIDATOR } from '../constants';

// 👇 this will extract the exact keys of your REGEX_VALIDATOR
type RegexValidatorKeys = keyof typeof REGEX_VALIDATOR;

export function RegexValidator(field: RegexValidatorKeys) {
  const validator = REGEX_VALIDATOR[field];

  if (!validator) {
    throw new BadRequestException(`invalid REGEX_VALIDATOR field: "${field}"`);
  }

  return applyDecorators(
    Matches(validator.regex, {
      message: validator.message,
    }),
  );
}
