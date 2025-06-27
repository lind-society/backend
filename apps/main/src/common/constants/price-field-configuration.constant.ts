import { IPriceFieldConfig } from '../interfaces';

export const PRICE_FIELD_CONFIGURATIONS: Record<string, IPriceFieldConfig> = {
  // Activity
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

  // Villa
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

  villaPriceRule: {
    priceFields: [],
    discountFields: ['discount'],
    priceToAfterDiscountMap: {},
    discountTypeFields: ['discountType'],
  },

  // Property
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

  // Feature
  feature: {
    priceFields: ['price', 'additionalPrice'],
    discountFields: ['discount'],
    priceToAfterDiscountMap: {
      price: 'priceAfterDiscount',
      additionalPrice: 'additionalPriceAfterDiscount',
    },
    discountTypeFields: ['discountType'],
  },

  // Booking
  bookingPayment: {
    priceFields: ['amount'],
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

  activityBooking: {
    priceFields: ['totalAmount'],
    discountFields: [],
    priceToAfterDiscountMap: {},
    discountTypeFields: [],
    nestedObjects: [
      {
        objectField: 'activity',
        config: {
          priceFields: ['price'],
          discountFields: ['discount'],
          priceToAfterDiscountMap: { price: 'priceAfterDisccount' },
          discountTypeFields: ['discountType'],
        },
      },
    ],
  },
  villaBooking: {
    priceFields: ['totalAmount'],
    discountFields: [],
    priceToAfterDiscountMap: {},
    discountTypeFields: [],
    nestedObjects: [
      {
        objectField: 'villa',
        config: {
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
        },
      },
    ],
  },

  // Owner
  owner: {
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
          priceToAfterDiscountMap: { price: 'priceAfterDisccount' },
          discountTypeFields: ['discountType'],
        },
      },
      {
        arrayField: 'properties',
        config: {
          priceFields: ['price'],
          discountFields: ['discount'],
          priceToAfterDiscountMap: { price: 'priceAfterDisccount' },
          discountTypeFields: ['discountType'],
        },
      },
      {
        arrayField: 'villas',
        config: {
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
        },
      },
    ],
  },

  // reviews
  review: {
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
      {
        objectField: 'villaBooking',
        config: {
          priceFields: ['totalAmount'],
          discountFields: [],
          priceToAfterDiscountMap: {},
          discountTypeFields: [],
        },
      },
      {
        objectField: 'activity',
        config: {
          priceFields: ['price'],
          discountFields: ['discount'],
          priceToAfterDiscountMap: { price: 'priceAfterDisccount' },
          discountTypeFields: ['discountType'],
        },
      },
      {
        objectField: 'villas',
        config: {
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
        },
      },
    ],
  },
};
