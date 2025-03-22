import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrencyConverterService } from 'src/modules/currency/converter/currency-converter.service';
import { CurrencyService } from 'src/modules/currency/currency.service';
import { PropertyWithRelationsDto } from 'src/modules/property/dto';
import { VillaWithRelationsDto } from 'src/modules/villa/dto';
import { formatPrice } from '../helpers';

@Injectable()
export class PriceConverterInterceptor implements NestInterceptor {
  constructor(
    private readonly currencyService: CurrencyService,
    private readonly currencyConverterService: CurrencyConverterService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const baseCurrencyId = request.query.baseCurrencyId;

    if (!baseCurrencyId) {
      return next.handle().pipe(
        map(async (data) => {
          if (data && Array.isArray(data.data?.data)) {
            const trasformedData = await Promise.all(
              data.data.data.map(
                (item: PropertyWithRelationsDto | VillaWithRelationsDto) =>
                  this._formatPricesFromPayload(item),
              ),
            );

            data.data.data = trasformedData;

            return data;
          }

          const trasformedData = await this._formatPricesFromPayload(data.data);

          data.data = trasformedData;

          return data;
        }),
      );
    }

    return next.handle().pipe(
      map(async (data) => {
        if (data && Array.isArray(data.data.data)) {
          const trasformedData = await Promise.all(
            data.data.data.map(
              (item: PropertyWithRelationsDto | VillaWithRelationsDto) =>
                this._convertPricesFromPayload(item, baseCurrencyId),
            ),
          );

          data.data.data = trasformedData;

          return data;
        }

        const trasformedData = await this._convertPricesFromPayload(
          data.data,
          baseCurrencyId,
        );

        data.data = trasformedData;

        return data;
      }),
    );
  }

  private async _convertPricesFromPayload(
    obj: any,
    baseCurrencyId: string,
  ): Promise<any> {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }
    const converted = { ...obj };
    const currencyId = obj.currencyId;

    if (!currencyId || currencyId === baseCurrencyId) {
      return obj;
    }

    const convertedCurrency =
      await this.currencyService.findOne(baseCurrencyId);

    const { allowDecimal, allowRound } = convertedCurrency;

    try {
      // Format discount values as strings
      if (obj.discount !== undefined && obj.discount !== null) {
        converted.discount = this._formatDiscount(obj.discount);
      }

      const activityPriceFields = ['pricePerPerson', 'pricePerSession'];
      const activityPriceAfterDiscountFields = [
        'pricePerPersonAfterDiscount',
        'pricePerSessionAfterDiscount',
      ];

      const villaPriceFields = ['priceDaily', 'priceMonthly', 'priceYearly'];
      const villaDiscountFields = [
        'discountDaily',
        'discountMonthly',
        'discountYearly',
      ];
      const villaPriceAfterDiscountFields = [
        'priceDailyAfterDiscount',
        'priceMonthlyAfterDiscount',
        'priceYearlyAfterDiscount',
      ];

      // Format all villa discount fields as strings
      for (const discountField of villaDiscountFields) {
        if (obj[discountField] !== undefined && obj[discountField] !== null) {
          converted[discountField] = this._formatDiscount(obj[discountField]);
        }
      }

      for (const priceField of activityPriceFields) {
        if (obj[priceField] !== undefined && obj[priceField] !== null) {
          const convertedPrice =
            await this.currencyConverterService.convertPriceToBasePrice({
              price: obj[priceField],
              priceCurrencyId: currencyId,
              baseCurrencyId,
            });

          converted[priceField] = formatPrice(
            convertedPrice.basePrice,
            allowDecimal,
            allowRound,
          );

          // Recalculate activity price after discount
          const priceAfterDiscountField =
            activityPriceAfterDiscountFields[
              activityPriceFields.indexOf(priceField)
            ];

          if (
            obj.discount !== undefined &&
            obj.discount !== null &&
            convertedPrice.basePrice !== null
          ) {
            // Use the numeric discount value for calculation
            const discountValue = this._getDiscountValue(obj.discount);
            converted[priceAfterDiscountField] = formatPrice(
              converted[priceField] -
                (converted[priceField] * discountValue) / 100,
              allowDecimal,
              allowRound,
            );
          }
        }
      }

      // Convert villa price related field
      for (const priceField of villaPriceFields) {
        if (obj[priceField] !== undefined && obj[priceField] !== null) {
          const convertedPrice =
            await this.currencyConverterService.convertPriceToBasePrice({
              price: obj[priceField],
              priceCurrencyId: currencyId,
              baseCurrencyId,
            });

          converted[priceField] = formatPrice(
            convertedPrice.basePrice,
            allowDecimal,
            allowRound,
          );

          // Recalculate villa price after discount
          const discountField =
            villaDiscountFields[villaPriceFields.indexOf(priceField)];
          const priceAfterDiscountField =
            villaPriceAfterDiscountFields[villaPriceFields.indexOf(priceField)];

          if (
            obj[discountField] !== undefined &&
            obj[discountField] !== null &&
            convertedPrice.basePrice !== null
          ) {
            // Use the numeric discount value for calculation
            const discountValue = this._getDiscountValue(
              converted[discountField],
            );
            converted[priceAfterDiscountField] = formatPrice(
              converted[priceField] -
                (converted[priceField] * discountValue) / 100,
              allowDecimal,
              allowRound,
            );
          }
        }
      }

      // Handle property price related field
      if (obj.price !== undefined && obj.price !== null) {
        const convertedPrice =
          await this.currencyConverterService.convertPriceToBasePrice({
            price: obj.price,
            priceCurrencyId: currencyId,
            baseCurrencyId,
          });

        converted.price = formatPrice(
          convertedPrice.basePrice,
          allowDecimal,
          allowRound,
        );

        // Recalculate priceAfterDiscount for property
        if (
          obj.discount !== undefined &&
          obj.discount !== null &&
          convertedPrice.basePrice !== null
        ) {
          // Use the numeric discount value for calculation
          const discountValue = this._getDiscountValue(obj.discount);
          converted.priceAfterDiscount = formatPrice(
            convertedPrice.basePrice -
              (convertedPrice.basePrice * discountValue) / 100,
            allowDecimal,
            allowRound,
          );
        }
      }

      // Update the main currency info
      converted.currencyId = baseCurrencyId;
      converted.currency = convertedCurrency;

      // Handle features array (property / villa)
      if (Array.isArray(obj.features)) {
        converted.features = await Promise.all(
          obj.features.map(async (feature) => {
            const convertedFeature = { ...feature };

            // Format feature discount as string if it exists
            if (feature.discount !== undefined && feature.discount !== null) {
              convertedFeature.discount = this._formatDiscount(
                feature.discount,
              );
            }

            // Check if the feature has currency and price
            if (
              feature.price !== undefined &&
              feature.price !== null &&
              feature.currencyId &&
              feature.currencyId !== baseCurrencyId
            ) {
              const featureConvertedPrice =
                await this.currencyConverterService.convertPriceToBasePrice({
                  price: feature.price,
                  priceCurrencyId: feature.currencyId,
                  baseCurrencyId,
                });

              // Update feature price
              convertedFeature.price = formatPrice(
                featureConvertedPrice.basePrice,
                allowDecimal,
                allowRound,
              );

              const discountValue = this._getDiscountValue(feature.discount);

              convertedFeature.priceAfterDiscount = formatPrice(
                convertedFeature.price -
                  (convertedFeature.price * discountValue) / 100,
                allowDecimal,
                allowRound,
              );

              // Update feature currency
              convertedFeature.currencyId = baseCurrencyId;
              convertedFeature.currency = convertedCurrency;
            }

            return convertedFeature;
          }),
        );
      }
    } catch (error) {
      console.error('Price conversion failed:', error);
    }

    return converted;
  }

  private async _formatPricesFromPayload(obj: any): Promise<any> {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }
    const converted = { ...obj };
    const currencyId = obj.currencyId;

    if (!currencyId) {
      return obj;
    }

    const currency = await this.currencyService.findOne(currencyId);

    const { allowDecimal, allowRound } = currency;

    console.log({ allowDecimal });
    console.log({ allowRound });

    try {
      // Format discount values as strings
      if (obj.discount !== undefined && obj.discount !== null) {
        converted.discount = this._formatDiscount(obj.discount);
      }

      const activityPriceFields = ['pricePerPerson', 'pricePerSession'];
      const activityPriceAfterDiscountFields = [
        'pricePerPersonAfterDiscount',
        'pricePerSessionAfterDiscount',
      ];

      const villaPriceFields = ['priceDaily', 'priceMonthly', 'priceYearly'];
      const villaDiscountFields = [
        'discountDaily',
        'discountMonthly',
        'discountYearly',
      ];
      const villaPriceAfterDiscountFields = [
        'priceDailyAfterDiscount',
        'priceMonthlyAfterDiscount',
        'priceYearlyAfterDiscount',
      ];

      // Format all villa discount fields as strings
      for (const discountField of villaDiscountFields) {
        if (obj[discountField] !== undefined && obj[discountField] !== null) {
          converted[discountField] = this._formatDiscount(obj[discountField]);
        }
      }

      for (const priceField of activityPriceFields) {
        if (obj[priceField] !== undefined && obj[priceField] !== null) {
          converted[priceField] = formatPrice(
            obj[priceField],
            allowDecimal,
            allowRound,
          );

          // Recalculate activity price after discount
          const priceAfterDiscountField =
            activityPriceAfterDiscountFields[
              activityPriceFields.indexOf(priceField)
            ];

          if (
            obj.discount !== undefined &&
            obj.discount !== null &&
            obj[priceField] !== null
          ) {
            // Use the numeric discount value for calculation
            const discountValue = this._getDiscountValue(obj.discount);
            converted[priceAfterDiscountField] = formatPrice(
              obj[priceField] - (obj[priceField] * discountValue) / 100,
              allowDecimal,
              allowRound,
            );
          }
        }
      }

      // Convert villa price related field
      for (const priceField of villaPriceFields) {
        if (obj[priceField] !== undefined && obj[priceField] !== null) {
          converted[priceField] = formatPrice(
            obj[priceField],
            allowDecimal,
            allowRound,
          );

          // Recalculate villa price after discount
          const discountField =
            villaDiscountFields[villaPriceFields.indexOf(priceField)];
          const priceAfterDiscountField =
            villaPriceAfterDiscountFields[villaPriceFields.indexOf(priceField)];

          if (
            obj[discountField] !== undefined &&
            obj[discountField] !== null &&
            obj[priceField] !== null
          ) {
            // Use the numeric discount value for calculation
            const discountValue = this._getDiscountValue(obj[discountField]);

            converted[priceAfterDiscountField] = formatPrice(
              obj[priceField] - (obj[priceField] * discountValue) / 100,
              allowDecimal,
              allowRound,
            );
          }
        }
      }

      // Handle property price related field
      if (obj.price !== undefined && obj.price !== null) {
        obj.price = formatPrice(obj.price, allowDecimal, allowRound);

        // Recalculate priceAfterDiscount for property
        if (
          obj.discount !== undefined &&
          obj.discount !== null &&
          obj.price !== null
        ) {
          // Use the numeric discount value for calculation
          const discountValue = this._getDiscountValue(obj.discount);
          converted.priceAfterDiscount = formatPrice(
            obj.price - (obj.price * discountValue) / 100,
            allowDecimal,
            allowRound,
          );
        }
      }

      // Handle features array (property / villa)
      if (Array.isArray(obj.features)) {
        converted.features = await Promise.all(
          obj.features.map(async (feature) => {
            const convertedFeature = { ...feature };

            convertedFeature.price = formatPrice(
              convertedFeature.price,
              allowDecimal,
              allowRound,
            );

            // Format feature discount as string if it exists
            if (feature.discount !== undefined && feature.discount !== null) {
              convertedFeature.discount = this._formatDiscount(
                feature.discount,
              );
            }

            // Check if the feature has currency and price
            if (
              convertedFeature.price !== undefined &&
              convertedFeature.price !== null &&
              convertedFeature.currencyId
            ) {
              // Use the numeric discount value for calculation
              const discountValue = this._getDiscountValue(
                convertedFeature.discount,
              );
              convertedFeature.priceAfterDiscount = formatPrice(
                convertedFeature.price -
                  (convertedFeature.price * discountValue) / 100,
                allowDecimal,
                allowRound,
              );
            }

            return convertedFeature;
          }),
        );
      }
    } catch (error) {
      console.error('Price conversion failed:', error);
    }

    return converted;
  }

  private _formatDiscount(discount: string): string {
    if (discount === undefined || discount === null) {
      return '0';
    }

    const numValue = parseFloat(discount);

    if (isNaN(numValue)) {
      return '0';
    }

    // Check if the discount is a whole number
    if (Number.isInteger(numValue)) {
      return numValue.toString();
    } else {
      // Format with no trailing zeros
      return numValue.toString();
    }
  }

  private _getDiscountValue(discount: string): number {
    if (discount === undefined || discount === null) {
      return 0;
    }

    const numValue = parseFloat(discount);
    return isNaN(numValue) ? 0 : numValue;
  }
}
