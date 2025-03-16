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
      return next.handle();
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
            converted[priceAfterDiscountField] = formatPrice(
              convertedPrice.basePrice -
                (convertedPrice.basePrice * parseFloat(obj[discountField])) /
                  100,
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
          converted.priceAfterDiscount = formatPrice(
            convertedPrice.basePrice -
              (convertedPrice.basePrice * parseFloat(obj.discount)) / 100,
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
}
