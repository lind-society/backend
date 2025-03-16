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
    // Get the request and extract baseCurrencyId
    const request = context.switchToHttp().getRequest();
    const baseCurrencyId = request.query.baseCurrencyId;

    // If no baseCurrencyId provided, skip conversion
    if (!baseCurrencyId) {
      return next.handle();
    }

    // if base currency same as the current currency id, skip intercepting

    return next.handle().pipe(
      map(async (data) => {
        // Handle array responses (lists of entities)
        console.log('called');
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

        // Handle single entity responses
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

    console.log({ allowDecimal });
    console.log({ allowRound });

    const priceFields = ['priceDaily', 'priceMonthly', 'priceYearly'];
    const discountFields = [
      'discountDaily',
      'discountMonthly',
      'discountYearly',
    ];
    const priceAfterDiscountFields = [
      'priceDailyAfterDiscount',
      'priceMonthlyAfterDiscount',
      'priceYearlyAfterDiscount',
    ];

    try {
      for (const priceField of priceFields) {
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

          // **Recalculate price after discount**
          const discountField = discountFields[priceFields.indexOf(priceField)];
          const priceAfterDiscountField =
            priceAfterDiscountFields[priceFields.indexOf(priceField)];

          if (
            obj[discountField] !== undefined &&
            obj[discountField] !== null &&
            convertedPrice.basePrice !== null
          ) {
            // Apply the same formula as the stored column
            converted[priceAfterDiscountField] = formatPrice(
              convertedPrice.basePrice -
                (convertedPrice.basePrice * parseFloat(obj[discountField])) /
                  100,
              allowDecimal,
              allowRound,
            );
          }
        }
        converted.currencyId = baseCurrencyId;
        converted.currency = convertedCurrency;
      }
    } catch (error) {
      console.error('Price conversion failed:', error);
    }

    return converted;
  }
}
