export interface IConversionRequest {
  id: string;
  field: string;
  value: number;
  sourceCurrencyId: string;
  targetCurrencyId: string;
  objectPath: string;
}

export interface ICacheEntry<T> {
  data: T;
  timestamp: number;
}
