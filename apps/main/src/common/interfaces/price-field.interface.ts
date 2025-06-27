export interface IPriceFieldConfig {
  priceFields: string[];
  discountFields: string[];
  priceToAfterDiscountMap: Record<string, string>;
  discountTypeFields: string[];
  nestedArrays?: INestedArrayConfig[];
  nestedObjects?: INestedObjectConfig[];
}

export interface INestedArrayConfig {
  arrayField: string;
  config: IPriceFieldConfig;
}

export interface INestedObjectConfig {
  objectField: string;
  config: IPriceFieldConfig;
}
