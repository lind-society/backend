export const FEATURE_PRICE_FIELDS = ['price'];
export const FEATURE_PRICE_AFTER_DISCOUNT_FIELDS = ['priceAfterDiscount'];
export const FEATURE_DISCOUNT_FIELDS = ['discount'];
export const FEATURE_PRICE_TO_DISCOUNT_MAP = {
  price: 'discount',
};
export const FEATURE_PRICE_TO_AFTER_DISCOUNT_MAP = {
  price: 'priceAfterDiscount',
};

export const ACTIVITY_PRICE_FIELDS = ['price'];
export const ACTIVITY_PRICE_AFTER_DISCOUNT_FIELDS = ['priceAfterDiscount'];
export const ACTIVITY_DISCOUNT_FIELDS = ['discount'];
export const ACTIVITY_PRICE_TO_DISCOUNT_MAP = {
  price: 'discount',
};
export const ACTIVITY_PRICE_TO_AFTER_DISCOUNT_MAP = {
  price: 'priceAfterDiscount',
};

export const PROPERTY_PRICE_FIELDS = ['price'];
export const PROPERTY_PRICE_AFTER_DISCOUNT_FIELDS = ['priceAfterDiscount'];
export const PROPERTY_DISCOUNT_FIELDS = ['discount'];
export const PROPERTY_PRICE_TO_DISCOUNT_MAP = {
  price: 'discount',
};
export const PROPERTY_PRICE_TO_AFTER_DISCOUNT_MAP = {
  price: 'priceAfterDiscount',
};

export const VILLA_PRICE_FIELDS = [
  'dailyPrice',
  'lowSeasonDailyPrice',
  'highSeasonDailyPrice',
  'peakSeasonDailyPrice',
  'priceMonthly',
  'priceYearly',
];
export const VILLA_PRICE_AFTER_DISCOUNT_FIELDS = [
  'dailyPriceAfterDiscount',
  'lowSeasonDailyPriceAfterDiscount',
  'highSeasonDailyPriceAfterDiscount',
  'peakSeasonDailyPriceAfterDiscount',
  'priceMonthlyAfterDiscount',
  'priceYearlyAfterDiscount',
];
export const VILLA_DISCOUNT_FIELDS = [
  'discount',
  'discountMonthly',
  'discountYearly',
];

export const VILLA_PRICE_TO_DISCOUNT_MAP = {
  dailyPrice: 'discount',
  lowSeasonDailyPrice: 'discount',
  highSeasonDailyPrice: 'discount',
  peakSeasonDailyPrice: 'discount',
  priceMonthly: 'discountMonthly',
  priceYearly: 'discountYearly',
};

export const VILLA_PRICE_TO_AFTER_DISCOUNT_MAP = {
  dailyPrice: 'dailyPriceAfterDiscount',
  lowSeasonDailyPrice: 'lowSeasonDailyPriceAfterDiscount',
  highSeasonDailyPrice: 'highSeasonDailyPriceAfterDiscount',
  peakSeasonDailyPrice: 'peakSeasonDailyPriceAfterDiscount',
  priceMonthly: 'priceMonthlyAfterDiscount',
  priceYearly: 'priceYearlyAfterDiscount',
};

export const VILLA_PRICE_RATE_FIELDS = [
  'lowSeasonPriceRate',
  'highSeasonPriceRate',
  'peakSeasonPriceRate',
];

export const VILLA_DAILY_BASE_PRICE_FIELDS = [
  'dailyBasePrice',
  'dailyBasePriceAfterSeasonRate',
];
