import { Transform } from 'class-transformer';

export function ToDecimal(allowNull: boolean = true) {
  return Transform(({ value }) => {
    if (value === null || value === undefined) {
      return allowNull ? null : undefined;
    }

    const parsed = parseFloat(value);

    return isNaN(parsed) ? (allowNull ? null : undefined) : parsed;
  });
}
