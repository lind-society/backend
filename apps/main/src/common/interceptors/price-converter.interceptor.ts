import { CurrencyConverterService } from '@apps/main/modules/currency/converter/currency-converter.service';
import { CurrencyService } from '@apps/main/modules/currency/currency.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, switchMap } from 'rxjs';
import {
  ACTIVITY_DISCOUNT_FIELDS,
  ACTIVITY_PRICE_FIELDS,
  ACTIVITY_PRICE_TO_AFTER_DISCOUNT_MAP,
  ACTIVITY_PRICE_TO_DISCOUNT_MAP,
  FEATURE_DISCOUNT_FIELDS,
  FEATURE_PRICE_FIELDS,
  FEATURE_PRICE_TO_AFTER_DISCOUNT_MAP,
  FEATURE_PRICE_TO_DISCOUNT_MAP,
  PROPERTY_DISCOUNT_FIELDS,
  PROPERTY_PRICE_FIELDS,
  PROPERTY_PRICE_TO_AFTER_DISCOUNT_MAP,
  PROPERTY_PRICE_TO_DISCOUNT_MAP,
  VILLA_DISCOUNT_FIELDS,
  VILLA_PRICE_FIELDS,
  VILLA_PRICE_TO_AFTER_DISCOUNT_MAP,
  VILLA_PRICE_TO_DISCOUNT_MAP,
} from '../constants';
import { formatPrice } from '../helpers';

@Injectable()
export class PriceConverterInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PriceConverterInterceptor.name);

  constructor(
    private readonly currencyService: CurrencyService,
    private readonly currencyConverterService: CurrencyConverterService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const baseCurrencyId = request.query.baseCurrencyId;

    return next.handle().pipe(
      switchMap(async (data) => {
        const items = Array.isArray(data.data?.data)
          ? data.data.data
          : [data.data];

        const transformed = await Promise.all(
          items.map((item) =>
            baseCurrencyId
              ? this._convertPricesFromPayload(item, baseCurrencyId)
              : this._formatPricesFromPayload(item),
          ),
        );

        if (Array.isArray(data.data?.data)) {
          data.data.data = transformed;
        } else {
          data.data = transformed[0];
        }

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
      const trasformedData = await this._formatPricesFromPayload(converted);

      return trasformedData;
    }

    const isConvertedCurrencyExist =
      await this.currencyConverterService.isExist(currencyId, baseCurrencyId);

    const convertedCurrency = await this.currencyService.findOne(
      isConvertedCurrencyExist ? baseCurrencyId : currencyId, // switch back to the default currencyId if conversion not available
    );

    const { allowDecimal, allowRound } = convertedCurrency;

    try {
      await this._formatActivityPrices(
        converted,
        allowDecimal,
        allowRound,
        baseCurrencyId,
      );
      await this._formatVillaPrices(
        converted,
        allowDecimal,
        allowRound,
        baseCurrencyId,
      );
      await this._formatPropertyPrices(
        converted,
        allowDecimal,
        allowRound,
        baseCurrencyId,
      );
      await this._formatFeaturePrices(
        converted,
        allowDecimal,
        allowRound,
        baseCurrencyId,
      );

      converted.currencyId = baseCurrencyId;
      converted.currency = convertedCurrency;
    } catch (error) {
      this.logger.error('Price formatting failed:', error);
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

    try {
      await this._formatActivityPrices(converted, allowDecimal, allowRound);
      await this._formatVillaPrices(converted, allowDecimal, allowRound);
      await this._formatPropertyPrices(converted, allowDecimal, allowRound);
      await this._formatFeaturePrices(converted, allowDecimal, allowRound);
    } catch (error) {
      this.logger.error('Price formatting failed:', error);
    }

    return converted;
  }

  // Format Price Helper
  private async _formatActivityPrices(
    converted: any,
    allowDecimal: boolean,
    allowRound: boolean,
    baseCurrencyId?: string,
  ) {
    await this._formatPriceHelper(
      converted,
      allowDecimal,
      allowRound,
      ACTIVITY_DISCOUNT_FIELDS,
      ACTIVITY_PRICE_FIELDS,
      ACTIVITY_PRICE_TO_DISCOUNT_MAP,
      ACTIVITY_PRICE_TO_AFTER_DISCOUNT_MAP,
      baseCurrencyId,
    );
  }

  private async _formatVillaPrices(
    converted: any,
    allowDecimal: boolean,
    allowRound: boolean,
    baseCurrencyId?: string,
  ) {
    await this._formatPriceHelper(
      converted,
      allowDecimal,
      allowRound,
      VILLA_DISCOUNT_FIELDS,
      VILLA_PRICE_FIELDS,
      VILLA_PRICE_TO_DISCOUNT_MAP,
      VILLA_PRICE_TO_AFTER_DISCOUNT_MAP,
      baseCurrencyId,
    );
  }

  private async _formatPropertyPrices(
    converted: any,
    allowDecimal: boolean,
    allowRound: boolean,
    baseCurrencyId?: string,
  ) {
    await this._formatPriceHelper(
      converted,
      allowDecimal,
      allowRound,
      PROPERTY_DISCOUNT_FIELDS,
      PROPERTY_PRICE_FIELDS,
      PROPERTY_PRICE_TO_DISCOUNT_MAP,
      PROPERTY_PRICE_TO_AFTER_DISCOUNT_MAP,
      baseCurrencyId,
    );
  }

  private async _formatFeaturePrices(
    converted: any,
    allowDecimal: boolean,
    allowRound: boolean,
    baseCurrencyId?: string,
  ) {
    if (Array.isArray(converted.features)) {
      await Promise.all(
        converted.features.map((feature) =>
          this._formatPriceHelper(
            feature,
            allowDecimal,
            allowRound,
            FEATURE_DISCOUNT_FIELDS,
            FEATURE_PRICE_FIELDS,
            FEATURE_PRICE_TO_DISCOUNT_MAP,
            FEATURE_PRICE_TO_AFTER_DISCOUNT_MAP,
            baseCurrencyId,
          ),
        ),
      );
    }
  }

  private async _formatPriceHelper(
    converted: any,
    allowDecimal: boolean,
    allowRound: boolean,
    discountFields: string[],
    priceFields: string[],
    priceToDiscountMap: Record<string, string>,
    priceToAfterDiscountMap: Record<string, string>,
    baseCurrencyId?: string,
  ) {
    for (const discountField of discountFields) {
      if (
        converted[discountField] !== undefined &&
        converted[discountField] !== null
      ) {
        converted[discountField] = this._formatDiscount(
          converted[discountField],
        );
      }
    }

    for (const priceField of priceFields) {
      if (
        converted[priceField] !== undefined &&
        converted[priceField] !== null
      ) {
        const convertedPrice = baseCurrencyId
          ? (
              await this.currencyConverterService.convertPriceToBasePrice({
                basePrice: converted[priceField],
                baseCurrencyId: converted.currencyId,
                targetCurrencyId: baseCurrencyId,
              })
            ).converted?.price
          : undefined;

        const price = convertedPrice ?? converted[priceField];

        converted[priceField] = formatPrice(price, allowDecimal, allowRound);

        // Recalculate villa price after discount
        const discountField = priceToDiscountMap[priceField];
        const priceAfterDiscountField = priceToAfterDiscountMap[priceField];

        if (
          converted[discountField] !== undefined &&
          converted[discountField] !== null &&
          converted[priceField] !== null
        ) {
          // Use the numeric discount value for calculation
          const discountValue = this._getDiscountValue(
            converted[discountField],
          );

          converted[priceAfterDiscountField] = formatPrice(
            price - (price * discountValue) / 100,
            allowDecimal,
            allowRound,
          );
        }
      }
    }
  }

  // Common Helper
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
