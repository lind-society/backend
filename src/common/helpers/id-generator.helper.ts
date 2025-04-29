import { generateRandomSixDigitNumber } from 'src/common/helpers';

export function idGenerator(entityName: string): string {
  return `${entityName}-${generateRandomSixDigitNumber()}`;
}
