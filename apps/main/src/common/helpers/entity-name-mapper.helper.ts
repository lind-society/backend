import { PluralEntityName, SingularEntityName } from '../enums';

export const entityNameMap: Record<SingularEntityName, PluralEntityName> = {
  [SingularEntityName.Activity]: PluralEntityName.Activity,
  [SingularEntityName.Property]: PluralEntityName.Property,
  [SingularEntityName.Villa]: PluralEntityName.Villa,
};

export function entityNameMapper(entityName: string): PluralEntityName {
  return entityNameMap[entityName];
}
