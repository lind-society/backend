import { IPriceFieldConfig } from '../interfaces';

export const PRICE_FIELD_CONFIGURATIONS: Record<string, IPriceFieldConfig> = {
  activityCategory: {
    priceFields: [],
    discountFields: [],
    priceToAfterDiscountMap: {},
    discountTypeFields: [],
    nestedArrays: [
      {
        arrayField: 'activities',
        config: {
          priceFields: ['price'],
          discountFields: ['discount'],
          priceToAfterDiscountMap: { price: 'priceAfterDiscount' },
          discountTypeFields: ['discountType'],
          nestedObjects: [
            {
              objectField: 'activityBooking',
              config: {
                priceFields: ['totalAmount'],
                discountFields: [],
                priceToAfterDiscountMap: {},
                discountTypeFields: [],
              },
            },
          ],
        },
      },
    ],
  },
  activity: {
    priceFields: ['price'],
    discountFields: ['discount'],
    priceToAfterDiscountMap: {
      price: 'priceAfterDiscount',
    },
    discountTypeFields: ['discountType'],
    nestedArrays: [
      {
        arrayField: 'reviews',
        config: {
          priceFields: [],
          discountFields: [],
          priceToAfterDiscountMap: {},
          discountTypeFields: [],
          nestedObjects: [
            {
              objectField: 'activityBooking',
              config: {
                priceFields: ['totalAmount'],
                discountFields: [],
                priceToAfterDiscountMap: {},
                discountTypeFields: [],
              },
            },
          ],
        },
      },
    ],
  },
  villa: {
    priceFields: [
      'dailyPrice',
      'lowSeasonDailyPrice',
      'highSeasonDailyPrice',
      'peakSeasonDailyPrice',
      'priceMonthly',
      'priceYearly',
    ],
    discountFields: ['discount', 'weekendDiscount'],
    priceToAfterDiscountMap: {
      dailyPrice: 'dailyPriceAfterDiscount',
      lowSeasonDailyPrice: 'lowSeasonDailyPriceAfterDiscount',
      highSeasonDailyPrice: 'highSeasonDailyPriceAfterDiscount',
      peakSeasonDailyPrice: 'peakSeasonDailyPriceAfterDiscount',
      priceMonthly: 'priceMonthlyAfterDiscount',
      priceYearly: 'priceYearlyAfterDiscount',
    },
    discountTypeFields: ['discountMonthlyType', 'discountYearlyType'],
    nestedArrays: [
      {
        arrayField: 'priceRules',
        config: {
          priceFields: [],
          discountFields: [],
          priceToAfterDiscountMap: {},
          discountTypeFields: ['discountType'],
        },
      },
      {
        arrayField: 'features',
        config: {
          priceFields: ['price', 'additionalPrice'],
          discountFields: ['discount'],
          priceToAfterDiscountMap: {
            price: 'priceAfterDiscount',
            additionalPrice: 'additionalPriceAfterDiscount',
          },
          discountTypeFields: ['discountType'],
        },
      },
      {
        arrayField: 'reviews',
        config: {
          priceFields: [],
          discountFields: [],
          priceToAfterDiscountMap: {},
          discountTypeFields: [],
          nestedObjects: [
            {
              objectField: 'villaBooking',
              config: {
                priceFields: ['totalAmount'],
                discountFields: [],
                priceToAfterDiscountMap: {},
                discountTypeFields: [],
              },
            },
          ],
        },
      },
    ],
    nestedObjects: [
      {
        objectField: 'currentPrice',
        config: {
          priceFields: ['currentDailyPrice'],
          discountFields: ['currentDiscount'],
          priceToAfterDiscountMap: {
            currentDailyPrice: 'currentDailyPriceAfterDiscount',
          },
          discountTypeFields: ['currentDiscountType'],
        },
      },
    ],
  },
  property: {
    priceFields: ['price'],
    discountFields: ['discount'],
    priceToAfterDiscountMap: {
      price: 'priceAfterDiscount',
    },
    discountTypeFields: ['discountType'],
    nestedArrays: [
      {
        arrayField: 'features',
        config: {
          priceFields: ['price'],
          discountFields: ['discount'],
          priceToAfterDiscountMap: {
            price: 'priceAfterDiscount',
          },
          discountTypeFields: ['discountType'],
        },
      },
    ],
  },
  feature: {
    priceFields: ['price', 'additionalPrice'],
    discountFields: ['discount'],
    priceToAfterDiscountMap: {
      price: 'priceAfterDiscount',
      additionalPrice: 'additionalPriceAfterDiscount',
    },
    discountTypeFields: ['discountType'],
  },
};
