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
import { PRICE_FIELD_CONFIGURATIONS } from '../constants';
import { formatPrice } from '../helpers';
import { IPriceFieldConfig } from '../interfaces';

@Injectable()
export class PriceConverterInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PriceConverterInterceptor.name);

  // Add caching for currencies and conversion rates
  private exchangeRate: number;
  private defaultCurrencyId: string;
  private currencyCache = new Map<string, any>();
  private conversionCache = new Map<string, boolean>();
  private rateCache = new Map<string, number>();

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

        // Pre-load all currencies we'll need
        await this._preloadCurrencies(items, baseCurrencyId);
        this.defaultCurrencyId = Array.from(this.currencyCache.keys())[0];

        if (this.currencyCache.size <= 0 || !this.defaultCurrencyId) {
          return data;
        }

        // Always fetch the latest exchange rate once
        const latestRate = await this.currencyConverterService.getExchangeRate(
          this.defaultCurrencyId,
          baseCurrencyId,
        );

        if (!this.exchangeRate || this.exchangeRate !== latestRate) {
          this.exchangeRate = latestRate;
        }

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

  private async _preloadCurrencies(
    items: any[],
    baseCurrencyId?: string,
  ): Promise<void> {
    const currencyIds = new Set<string>();

    // Collect all currency IDs from the data
    this._collectCurrencyIds(items, currencyIds);

    if (baseCurrencyId) {
      currencyIds.add(baseCurrencyId);
    }

    if (currencyIds.size === 0) {
      return;
    }

    // Batch load all currencies
    await Promise.all(
      Array.from(currencyIds).map(async (id) => {
        if (!this.currencyCache.has(id)) {
          const currency = await this.currencyService.findOne(id);
          this.currencyCache.set(id, currency);
          return { id, currency };
        }
        return { id, currency: this.currencyCache.get(id) };
      }),
    );

    // Pre-check conversion availability if baseCurrencyId is provided
    if (baseCurrencyId) {
      const conversionChecks = Array.from(currencyIds)
        .filter((id) => id !== baseCurrencyId)
        .map(async (sourceCurrencyId) => {
          const cacheKey = `${sourceCurrencyId}-${baseCurrencyId}`;
          if (!this.conversionCache.has(cacheKey)) {
            const isAvailable =
              await this.currencyConverterService.validateExist(
                sourceCurrencyId,
                baseCurrencyId,
              );
            this.conversionCache.set(cacheKey, Boolean(isAvailable));
          }
        });

      await Promise.all(conversionChecks);
    }
  }

  private _collectCurrencyIds(items: any[], currencyIds: Set<string>): void {
    items.forEach((item) => {
      if (item?.currencyId) {
        currencyIds.add(item.currencyId);
      }

      // Collect from nested objects based on known structures
      this._collectFromNested(item, currencyIds);
    });
  }

  private _collectFromNested(obj: any, currencyIds: Set<string>): void {
    if (!obj || typeof obj !== 'object') return;

    // Handle common nested structures
    const nestedArrays = [
      'activities',
      'reviews',
      'villaFeatures',
      'villaPriceRules',
      'priceRules',
      'features',
    ];
    const nestedObjects = [
      'activityBooking',
      'villaBooking',
      'priceRule',
      'feature',
      'currency',
    ];

    nestedArrays.forEach((arrayField) => {
      if (Array.isArray(obj[arrayField])) {
        obj[arrayField].forEach((item) => {
          if (item?.currencyId) {
            currencyIds.add(item.currencyId);
          }
          this._collectFromNested(item, currencyIds);
        });
      }
    });

    nestedObjects.forEach((objectField) => {
      if (obj[objectField]) {
        if (obj[objectField].currencyId) {
          currencyIds.add(obj[objectField].currencyId);
        }
        this._collectFromNested(obj[objectField], currencyIds);
      }
    });
  }

  private async _convertPricesFromPayload(
    obj: any,
    baseCurrencyId: string,
  ): Promise<any> {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const converted = { ...obj };

    if (!this.defaultCurrencyId || this.defaultCurrencyId === baseCurrencyId) {
      return await this._formatPricesFromPayload(converted);
    }

    const isConvertedCurrencyExist = this._getCachedConversionAvailability(
      this.defaultCurrencyId,
      baseCurrencyId,
    );

    const convertedCurrency = this._getCachedCurrency(
      isConvertedCurrencyExist ? baseCurrencyId : this.defaultCurrencyId,
    );

    const { allowDecimal, allowRound } = convertedCurrency;

    try {
      const processedFields = new Set<string>();

      await this._processAllPriceFields(
        converted,
        allowDecimal,
        allowRound,
        baseCurrencyId,
        processedFields,
      );

      converted.currencyId = baseCurrencyId;
      converted.currency = convertedCurrency;
    } catch (error) {
      this.logger.error('Price conversion failed:', error);
    }

    return converted;
  }

  private async _formatPricesFromPayload(obj: any): Promise<any> {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const converted = { ...obj };

    const currency = this._getCachedCurrency(this.defaultCurrencyId);
    const { allowDecimal, allowRound } = currency;

    try {
      const processedFields = new Set<string>();

      await this._processAllPriceFields(
        converted,
        allowDecimal,
        allowRound,
        undefined,
        processedFields,
      );
    } catch (error) {
      this.logger.error('Price formatting failed:', error);
    }

    return converted;
  }

  private _getCachedCurrency(currencyId: string): any {
    return this.currencyCache.get(currencyId);
  }

  private _getCachedConversionAvailability(
    sourceCurrencyId: string,
    targetCurrencyId: string,
  ): boolean {
    const cacheKey = `${sourceCurrencyId}-${targetCurrencyId}`;
    return this.conversionCache.get(cacheKey) ?? false;
  }

  private async _processAllPriceFields(
    obj: any,
    allowDecimal: boolean,
    allowRound: boolean,
    baseCurrencyId?: string,
    processedFields: Set<string> = new Set(),
  ): Promise<void> {
    const entityType = this._detectEntityType(obj);

    if (entityType) {
      const config = PRICE_FIELD_CONFIGURATIONS[entityType];
      await this._processPriceFieldsWithConfig(
        obj,
        config,
        allowDecimal,
        allowRound,
        baseCurrencyId,
        processedFields,
      );
    }

    await this._processGenericPriceFields(
      obj,
      allowDecimal,
      allowRound,
      baseCurrencyId,
      processedFields,
    );
  }

  private _detectEntityType(obj: any): string | null {
    if (obj.activities !== undefined) {
      return 'activityCategory';
    }

    if (obj.duration !== undefined || obj.activities !== undefined) {
      return 'activity';
    }

    if (
      obj.priceRules !== undefined ||
      obj.bedrooms !== undefined ||
      obj.dailyPrice !== undefined
    ) {
      return 'villa';
    }

    if (obj.season !== undefined && obj.isAppliedToAllVilla !== undefined) {
      return 'villaPriceRule';
    }

    if (obj.ownershipType !== undefined) {
      return 'property';
    }

    if (obj.featureType !== undefined) {
      return 'feature';
    }

    if (obj.paymentMethod !== undefined) {
      return 'bookingPayment';
    }

    if (obj.totalAmount !== undefined && obj.activity !== undefined) {
      return 'activityBooking';
    }

    if (obj.totalAmount !== undefined && obj.villa !== undefined) {
      return 'villaBooking';
    }

    if (
      obj.companyName !== undefined &&
      obj.activities !== undefined &&
      obj.properties !== undefined &&
      obj.villas !== undefined
    ) {
      return 'owner';
    }

    if (
      obj.rating !== undefined &&
      obj.activityBooking !== undefined &&
      obj.activity !== undefined &&
      obj.villaBooking !== undefined &&
      obj.villa !== undefined
    ) {
      return 'review';
    }

    return null;
  }

  private async _processPriceFieldsWithConfig(
    obj: any,
    config: IPriceFieldConfig,
    allowDecimal: boolean,
    allowRound: boolean,
    baseCurrencyId?: string,
    processedFields: Set<string> = new Set(),
  ): Promise<void> {
    // Process discount fields first
    await this._formatDiscountFields(
      obj,
      config.discountFields,
      config.discountTypeFields,
      allowDecimal,
      allowRound,
      baseCurrencyId,
    );

    // Process price fields
    await this._formatPriceFields(
      obj,
      config.priceFields,
      config.priceToAfterDiscountMap,
      allowDecimal,
      allowRound,
      baseCurrencyId,
      processedFields,
    );

    // Process nested arrays
    if (config.nestedArrays) {
      for (const nestedConfig of config.nestedArrays) {
        if (Array.isArray(obj[nestedConfig.arrayField])) {
          await Promise.all(
            obj[nestedConfig.arrayField].map(async (item) => {
              await this._processNestedItem(
                item,
                nestedConfig.config,
                baseCurrencyId,
              );
            }),
          );
        }
      }
    }

    // Process nested objects
    if (config.nestedObjects) {
      for (const nestedConfig of config.nestedObjects) {
        if (obj[nestedConfig.objectField]) {
          await this._processNestedItem(
            obj[nestedConfig.objectField],
            nestedConfig.config,
            baseCurrencyId,
          );
        }
      }
    }
  }

  private async _processNestedItem(
    item: any,
    config: IPriceFieldConfig,
    baseCurrencyId?: string,
  ): Promise<void> {
    if (!item || typeof item !== 'object') {
      return;
    }

    const nestedCurrency = this._getCurrencyForNestedItem(item, baseCurrencyId);

    await this._processPriceFieldsWithConfig(
      item,
      config,
      nestedCurrency.allowDecimal,
      nestedCurrency.allowRound,
      baseCurrencyId,
      new Set(),
    );

    if (
      baseCurrencyId &&
      item.currencyId &&
      item.currencyId !== baseCurrencyId
    ) {
      const isConvertedCurrencyExist = this._getCachedConversionAvailability(
        item.currencyId,
        baseCurrencyId,
      );

      if (isConvertedCurrencyExist) {
        item.currencyId = baseCurrencyId;
        item.currency = nestedCurrency.currency;
      }
    }
  }

  private async _formatPriceFields(
    obj: any,
    priceFields: string[],
    priceToAfterDiscountMap: Record<string, string>,
    allowDecimal: boolean,
    allowRound: boolean,
    baseCurrencyId?: string,
    processedFields: Set<string> = new Set(),
  ): Promise<void> {
    // Batch process price conversions
    const conversionsNeeded: Array<{
      field: string;
      value: number;
      sourceCurrencyId: string;
    }> = [];

    // Collect all prices that need conversion
    for (const priceField of priceFields) {
      const fieldId = `${this._generateObjectId(obj)}_${priceField}`;

      if (
        processedFields.has(fieldId) ||
        obj[priceField] === undefined ||
        obj[priceField] === null
      ) {
        continue;
      }

      processedFields.add(fieldId);

      if (
        baseCurrencyId &&
        obj.currencyId &&
        obj.currencyId !== baseCurrencyId
      ) {
        conversionsNeeded.push({
          field: priceField,
          value: obj[priceField],
          sourceCurrencyId: obj.currencyId,
        });
      }

      // Handle price after discount
      const priceAfterDiscountField = priceToAfterDiscountMap[priceField];
      if (
        priceAfterDiscountField &&
        obj[priceAfterDiscountField] !== undefined &&
        obj[priceAfterDiscountField] !== null
      ) {
        if (
          baseCurrencyId &&
          obj.currencyId &&
          obj.currencyId !== baseCurrencyId
        ) {
          conversionsNeeded.push({
            field: priceAfterDiscountField,
            value: obj[priceAfterDiscountField],
            sourceCurrencyId: obj.currencyId,
          });
        }
      }
    }

    // Batch convert prices
    const conversions = await Promise.all(
      conversionsNeeded.map(async ({ field, value, sourceCurrencyId }) => ({
        field,
        convertedPrice: await this._convertSinglePrice(
          value,
          sourceCurrencyId,
          baseCurrencyId,
        ),
        originalPrice: value,
      })),
    );

    // Apply conversions and formatting
    for (const priceField of priceFields) {
      const conversion = conversions.find((c) => c.field === priceField);
      if (conversion) {
        obj[priceField] = formatPrice(
          conversion.convertedPrice ?? conversion.originalPrice,
          allowDecimal,
          allowRound,
        );
      } else if (obj[priceField] !== undefined && obj[priceField] !== null) {
        obj[priceField] = formatPrice(
          obj[priceField],
          allowDecimal,
          allowRound,
        );
      }

      // Handle price after discount
      const priceAfterDiscountField = priceToAfterDiscountMap[priceField];
      if (
        priceAfterDiscountField &&
        obj[priceAfterDiscountField] !== undefined
      ) {
        const afterDiscountConversion = conversions.find(
          (c) => c.field === priceAfterDiscountField,
        );
        if (afterDiscountConversion) {
          obj[priceAfterDiscountField] = formatPrice(
            afterDiscountConversion.convertedPrice ??
              afterDiscountConversion.originalPrice,
            allowDecimal,
            allowRound,
          );
        } else {
          obj[priceAfterDiscountField] = formatPrice(
            obj[priceAfterDiscountField],
            allowDecimal,
            allowRound,
          );
        }
      }
    }
  }

  private async _formatDiscountFields(
    obj: any,
    discountFields: string[],
    discountTypeFields: string[],
    allowDecimal: boolean,
    allowRound: boolean,
    baseCurrencyId?: string,
  ): Promise<void> {
    for (const discountField of discountFields) {
      if (obj[discountField] === undefined || obj[discountField] === null) {
        continue;
      }

      const isPercentageDiscount = discountTypeFields.some(
        (typeField) => obj[typeField] === DiscountType.Percentage,
      );

      const isFixedDiscount = discountTypeFields.some(
        (typeField) => obj[typeField] === DiscountType.Fixed,
      );

      if (isPercentageDiscount) {
        obj[discountField] = this._formatPercentageDiscount(obj[discountField]);
      } else if (isFixedDiscount) {
        obj[discountField] = await this._formatFixedDiscount(
          obj[discountField],
          obj.currencyId,
          allowDecimal,
          allowRound,
          baseCurrencyId,
        );
      }
    }
  }

  private async _convertSinglePrice(
    price: number,
    sourceCurrencyId: string,
    targetCurrencyId?: string,
  ): Promise<number | undefined> {
    if (
      !targetCurrencyId ||
      !sourceCurrencyId ||
      sourceCurrencyId === targetCurrencyId
    ) {
      return undefined;
    }

    const rateKey = `${sourceCurrencyId}-${targetCurrencyId}`;

    try {
      const cachedRate = this.rateCache.get(rateKey);

      // Update the cache if it's new or changed
      if (cachedRate !== this.exchangeRate) {
        this.logger.debug(
          `Exchange rate updated for ${rateKey}: ${cachedRate} -> ${this.exchangeRate}`,
        );
        this.rateCache.set(rateKey, this.exchangeRate);
      }

      return price * this.exchangeRate;
    } catch (error) {
      this.logger.error('Currency conversion failed:', error);
      return undefined;
    }
  }

  private async _processGenericPriceFields(
    obj: any,
    allowDecimal: boolean,
    allowRound: boolean,
    baseCurrencyId?: string,
    processedFields: Set<string> = new Set(),
  ): Promise<void> {
    const genericPriceFields = [
      'price',
      'amount',
      'totalAmount',
      'cost',
      'fee',
    ];

    for (const field of genericPriceFields) {
      const fieldId = `${this._generateObjectId(obj)}_${field}`;

      if (
        !processedFields.has(fieldId) &&
        obj[field] !== undefined &&
        obj[field] !== null &&
        typeof obj[field] === 'number'
      ) {
        processedFields.add(fieldId);

        const convertedPrice = await this._convertSinglePrice(
          obj[field],
          obj.currencyId,
          baseCurrencyId,
        );

        obj[field] = formatPrice(
          convertedPrice ?? obj[field],
          allowDecimal,
          allowRound,
        );
      }
    }
  }

  private _generateObjectId(obj: any): string {
    return obj.id || obj._id || JSON.stringify(obj).slice(0, 50);
  }

  private _formatPercentageDiscount(discount: string | number): string {
    if (discount === undefined || discount === null) {
      return '0';
    }

    const numValue =
      typeof discount === 'string' ? parseFloat(discount) : discount;

    if (isNaN(numValue)) {
      return '0';
    }

    return Number.isInteger(numValue)
      ? numValue.toString()
      : numValue.toString();
  }

  private async _formatFixedDiscount(
    discount: number,
    sourceCurrencyId: string,
    allowDecimal: boolean,
    allowRound: boolean,
    targetCurrencyId?: string,
  ): Promise<string> {
    if (!targetCurrencyId) {
      return formatPrice(discount, allowDecimal, allowRound);
    }

    try {
      const convertedPrice = await this._convertSinglePrice(
        discount,
        sourceCurrencyId,
        targetCurrencyId,
      );

      return formatPrice(convertedPrice ?? discount, allowDecimal, allowRound);
    } catch (error) {
      this.logger.error('Fixed discount conversion failed:', error);
      return formatPrice(discount, allowDecimal, allowRound);
    }
  }

  private _getCurrencyForNestedItem(
    item: any,
    baseCurrencyId?: string,
  ): {
    currency: any;
    allowDecimal: boolean;
    allowRound: boolean;
  } {
    if (!baseCurrencyId || !item.currencyId) {
      const currency =
        item.currency || this._getCachedCurrency(item.currencyId);
      return {
        currency,
        allowDecimal: currency?.allowDecimal ?? true,
        allowRound: currency?.allowRound ?? false,
      };
    }

    const isConvertedCurrencyExist = this._getCachedConversionAvailability(
      item.currencyId,
      baseCurrencyId,
    );

    const targetCurrencyId = isConvertedCurrencyExist
      ? baseCurrencyId
      : item.currencyId;
    const currency = this._getCachedCurrency(targetCurrencyId);

    return {
      currency,
      allowDecimal: currency?.allowDecimal ?? true,
      allowRound: currency?.allowRound ?? false,
    };
  }

  private async _checkCurrencyIdExist(obj: any): Promise<string | null> {
    if (Array.isArray(obj)) {
      for (const item of obj) {
        const id = await this._checkCurrencyIdExist(item);
        if (id) return id;
      }
    } else if (typeof obj === 'object' && obj !== null) {
      if (obj.currencyId) {
        return obj.currencyId;
      }

      for (const key of Object.keys(obj)) {
        const id = await this._checkCurrencyIdExist(obj[key]);
        if (id) return id;
      }
    }

    return null;
  }
}
