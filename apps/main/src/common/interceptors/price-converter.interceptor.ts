import { DiscountType } from '@apps/main/database/entities';
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
  DISCOUNT_TYPE_FIELDS,
  FEATURE_DISCOUNT_FIELDS,
  FEATURE_PRICE_FIELDS,
  FEATURE_PRICE_TO_AFTER_DISCOUNT_MAP,
  PROPERTY_DISCOUNT_FIELDS,
  PROPERTY_PRICE_FIELDS,
  PROPERTY_PRICE_TO_AFTER_DISCOUNT_MAP,
  VILLA_CURRENT_DISCOUNT_FIELDS,
  VILLA_CURRENT_PRICE_FIELDS,
  VILLA_CURRENT_PRICE_TO_AFTER_DISCOUNT_MAP,
  VILLA_DISCOUNT_FIELDS,
  VILLA_PRICE_FIELDS,
  VILLA_PRICE_RULE_DISCOUNT_FIELDS,
  VILLA_PRICE_TO_AFTER_DISCOUNT_MAP,
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
      return await this._formatPricesFromPayload(converted);
    }

    const isConvertedCurrencyExist =
      await this.currencyConverterService.isExist(currencyId, baseCurrencyId);

    const convertedCurrency = await this.currencyService.findOne(
      isConvertedCurrencyExist ? baseCurrencyId : currencyId, // switch back to the default currencyId if conversion not available
    );

    const { allowDecimal, allowRound } = convertedCurrency;

    try {
      const processedFields = new Set<string>();

      await this._formatActivityPrices(
        converted,
        allowDecimal,
        allowRound,
        baseCurrencyId,
        processedFields,
      );

      await this._formatVillaPrices(
        converted,
        allowDecimal,
        allowRound,
        baseCurrencyId,
        processedFields,
      );

      await this._formatVillaPriceRulPrices(
        converted,
        allowDecimal,
        allowRound,
        baseCurrencyId,
        processedFields,
      );

      await this._formatPropertyPrices(
        converted,
        allowDecimal,
        allowRound,
        baseCurrencyId,
        processedFields,
      );

      await this._formatFeaturePrices(
        converted,
        allowDecimal,
        allowRound,
        baseCurrencyId,
        processedFields,
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
      await this._formatVillaPriceRulPrices(
        converted,
        allowDecimal,
        allowRound,
      );
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
    processedFields?: Set<string>,
  ) {
    await this._formatPriceHelper(
      converted,
      allowDecimal,
      allowRound,
      ACTIVITY_DISCOUNT_FIELDS,
      ACTIVITY_PRICE_FIELDS,
      ACTIVITY_PRICE_TO_AFTER_DISCOUNT_MAP,
      baseCurrencyId,
      processedFields,
    );
  }

  private async _formatVillaPrices(
    converted: any,
    allowDecimal: boolean,
    allowRound: boolean,
    baseCurrencyId?: string,
    processedFields?: Set<string>,
  ) {
    await this._formatPriceHelper(
      converted,
      allowDecimal,
      allowRound,
      VILLA_DISCOUNT_FIELDS,
      VILLA_PRICE_FIELDS,
      VILLA_PRICE_TO_AFTER_DISCOUNT_MAP,
      baseCurrencyId,
      processedFields,
    );

    if (
      Array.isArray(converted.priceRules) &&
      converted.priceRules.length > 0
    ) {
      await Promise.all(
        converted.priceRules.map((priceRule) =>
          this._formatDiscountBaseOnTypeHelper(
            priceRule,
            VILLA_PRICE_RULE_DISCOUNT_FIELDS,
            allowDecimal,
            allowRound,
            baseCurrencyId,
          ),
        ),
      );
    }

    if (converted.currentPrice) {
      await this._formatPriceHelper(
        converted.currentPrice,
        allowDecimal,
        allowRound,
        VILLA_CURRENT_DISCOUNT_FIELDS,
        VILLA_CURRENT_PRICE_FIELDS,
        VILLA_CURRENT_PRICE_TO_AFTER_DISCOUNT_MAP,
        baseCurrencyId,
        processedFields,
      );
    }
  }

  private async _formatVillaPriceRulPrices(
    converted: any,
    allowDecimal: boolean,
    allowRound: boolean,
    baseCurrencyId?: string,
    processedFields?: Set<string>,
  ) {
    await this._formatDiscountBaseOnTypeHelper(
      converted,
      VILLA_PRICE_RULE_DISCOUNT_FIELDS,
      allowDecimal,
      allowRound,
      baseCurrencyId,
    );
  }

  private async _formatPropertyPrices(
    converted: any,
    allowDecimal: boolean,
    allowRound: boolean,
    baseCurrencyId?: string,
    processedFields?: Set<string>,
  ) {
    await this._formatPriceHelper(
      converted,
      allowDecimal,
      allowRound,
      PROPERTY_DISCOUNT_FIELDS,
      PROPERTY_PRICE_FIELDS,
      PROPERTY_PRICE_TO_AFTER_DISCOUNT_MAP,
      baseCurrencyId,
      processedFields,
    );
  }

  private async _formatFeaturePrices(
    converted: any,
    allowDecimal: boolean,
    allowRound: boolean,
    baseCurrencyId?: string,
    processedFields?: Set<string>,
  ) {
    if (Array.isArray(converted.features) && converted.features.length > 0) {
      await Promise.all(
        converted.features.map((feature) =>
          this._formatPriceHelper(
            feature,
            allowDecimal,
            allowRound,
            FEATURE_DISCOUNT_FIELDS,
            FEATURE_PRICE_FIELDS,
            FEATURE_PRICE_TO_AFTER_DISCOUNT_MAP,
            baseCurrencyId,
            processedFields,
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
    priceToAfterDiscountMap: Record<string, string>,
    baseCurrencyId?: string,
    processedFields: Set<string> = new Set(),
  ) {
    await this._formatDiscountBaseOnTypeHelper(
      converted,
      discountFields,
      allowDecimal,
      allowRound,
      baseCurrencyId,
    );

    for (const priceField of priceFields) {
      // 🛡️ Prevent double conversion
      if (
        processedFields.has(priceField) ||
        converted[priceField] === undefined ||
        converted[priceField] === null
      ) {
        continue;
      }

      processedFields.add(priceField);

      const res = await this.currencyConverterService.convertPriceToBasePrice({
        basePrice: converted[priceField],
        baseCurrencyId: converted.currencyId,
        targetCurrencyId: baseCurrencyId,
      });

      const convertedPrice = baseCurrencyId ? res.converted?.price : undefined;

      const price = convertedPrice ?? converted[priceField];
      converted[priceField] = formatPrice(price, allowDecimal, allowRound);

      // Recalculate price after discount
      const priceAfterDiscountField = priceToAfterDiscountMap[priceField];
      if (
        converted[priceAfterDiscountField] !== undefined &&
        converted[priceAfterDiscountField] !== null
      ) {
        const convertedPriceAfterDiscount = baseCurrencyId
          ? (
              await this.currencyConverterService.convertPriceToBasePrice({
                basePrice: converted[priceAfterDiscountField],
                baseCurrencyId: converted.currencyId,
                targetCurrencyId: baseCurrencyId,
              })
            ).converted?.price
          : undefined;

        const priceAfterDiscount =
          convertedPriceAfterDiscount ?? converted[priceAfterDiscountField];

        converted[priceAfterDiscountField] = formatPrice(
          priceAfterDiscount,
          allowDecimal,
          allowRound,
        );
      }
    }
  }

  private async _formatDiscountBaseOnTypeHelper(
    converted: any,
    discountFields: string[],
    allowDecimal: boolean,
    allowRound: boolean,
    baseCurrencyId?: string,
  ) {
    try {
      for (const discountField of discountFields) {
        if (
          converted[discountField] === undefined ||
          converted[discountField] === null
        ) {
          continue;
        }

        const isPercentageDiscount = DISCOUNT_TYPE_FIELDS.some(
          (typeField) => converted[typeField] === DiscountType.Percentage,
        );

        const isFixedDiscount = DISCOUNT_TYPE_FIELDS.some(
          (typeField) => converted[typeField] === DiscountType.Fixed,
        );

        if (isPercentageDiscount) {
          converted[discountField] = this._formatPercentageDiscountHelper(
            converted[discountField],
          );
        } else if (isFixedDiscount) {
          converted[discountField] = await this.formattedFixedDiscountHelper(
            converted[discountField],
            converted.currencyId,
            allowDecimal,
            allowRound,
            baseCurrencyId,
          );
        }
      }
    } catch (error) {
      this.logger.error('Error in discount processing interceptor:', error);
    }

    return converted;
  }

  // Helper method to handle fixed discount formatting
  async formattedFixedDiscountHelper(
    discount: number,
    sourceCurrencyId: string,
    allowDecimal: boolean,
    allowRound: boolean,
    targetCurrencyId?: string,
  ) {
    if (!targetCurrencyId) {
      return formatPrice(discount, allowDecimal, allowRound);
    }

    try {
      const result =
        await this.currencyConverterService.convertPriceToBasePrice({
          basePrice: discount,
          baseCurrencyId: sourceCurrencyId,
          targetCurrencyId: targetCurrencyId,
        });

      const convertedPrice = result?.converted?.price;
      const finalPrice =
        convertedPrice !== undefined ? convertedPrice : discount;

      return formatPrice(finalPrice, allowDecimal, allowRound);
    } catch (error) {
      this.logger.error(
        ` ${this.formattedFixedDiscountHelper.name} : Currency conversion failed:`,
        error,
      );

      return formatPrice(discount, allowDecimal, allowRound);
    }
  }

  // Common Helper
  private _formatPercentageDiscountHelper(discount: string): string {
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
