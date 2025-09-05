import { Transform } from 'class-transformer';

export function ToHour() {
  return Transform(({ value }) => {
    if (value === null || value === undefined) {
      return undefined;
    }

    return value.slice(0, 5);
  });
}
