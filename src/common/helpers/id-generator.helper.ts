import { generateRandomSixDigitNumber } from 'src/common/utils';

export function idGenerator(entityName: string): string {
  return `${entityName}-${generateRandomSixDigitNumber()}`;
}
