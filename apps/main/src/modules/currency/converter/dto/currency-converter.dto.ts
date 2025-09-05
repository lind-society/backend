import { ToDecimal } from '@apps/main/common/decorators';
import { Currency, CurrencyConverter } from '@apps/main/database/entities';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { CurrencyDto, RelatedCurrencyDto } from '../../dto';

export interface ICurrencyConverterDto
  extends Omit<CurrencyConverter, 'baseCurrency' | 'targetCurrency'> {}

export interface ICurrencyConverterWithRelationsDto
  extends ICurrencyConverterDto {
  baseCurrency?: CurrencyDto;
  targetCurrency?: CurrencyDto;
}

export interface ICurrencyConverterPaginationDto
  extends Omit<
    CurrencyConverter,
    'updatedAt' | 'deletedAt' | 'baseCurrency' | 'targetCurrency'
  > {
  baseCurrency?: RelatedCurrencyDto;
  targetCurrency?: RelatedCurrencyDto;
}

export interface IRelatedCurrencyConverterDto
  extends Pick<CurrencyConverter, 'id' | 'exchangeRate'> {
  baseCurrency?: RelatedCurrencyDto;
  targetCurrency?: RelatedCurrencyDto;
}

export class CurrencyConverterDto implements ICurrencyConverterDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly baseCurrencyId!: string;

  @Expose()
  readonly targetCurrencyId!: string;

  @Expose()
  @ToDecimal()
  readonly exchangeRate!: number;

  @Expose()
  readonly description!: string | null;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: CurrencyConverter): CurrencyConverterDto {
    return plainToInstance(CurrencyConverterDto, entity);
  }

  static fromEntities(entities: CurrencyConverter[]): CurrencyConverterDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class CurrencyConverterWithRelationsDto
  extends CurrencyConverterDto
  implements ICurrencyConverterWithRelationsDto
{
  @Expose()
  baseCurrency?: CurrencyDto;

  @Expose()
  targetCurrency?: CurrencyDto;

  static fromEntity(
    entity: CurrencyConverter & {
      baseCurrency?: Currency;
      targetCurrency?: Currency;
    },
  ): CurrencyConverterWithRelationsDto {
    const dto = plainToInstance(CurrencyConverterWithRelationsDto, entity);

    if (entity.baseCurrency) {
      dto.baseCurrency = CurrencyDto.fromEntity(dto.baseCurrency);
    }

    if (entity.targetCurrency) {
      dto.targetCurrency = CurrencyDto.fromEntity(dto.targetCurrency);
    }

    return dto;
  }

  static fromEntities(
    entities: (CurrencyConverter & {
      baseCurrency?: Currency;
      targetCurrency?: Currency;
    })[],
  ): CurrencyConverterWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class CurrencyConverterPaginationDto
  implements ICurrencyConverterPaginationDto
{
  @Expose()
  readonly id!: string;

  @Expose()
  readonly baseCurrencyId!: string;

  @Expose()
  readonly targetCurrencyId!: string;

  @Expose()
  @ToDecimal()
  readonly exchangeRate!: number;

  @Expose()
  readonly description!: string | null;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  baseCurrency?: RelatedCurrencyDto;

  @Expose()
  targetCurrency?: RelatedCurrencyDto;

  static fromEntity(entity: CurrencyConverter): CurrencyConverterPaginationDto {
    const dto = plainToInstance(CurrencyConverterPaginationDto, entity);

    if (entity.baseCurrency) {
      dto.baseCurrency = RelatedCurrencyDto.fromEntity(entity.baseCurrency);
    }

    if (entity.targetCurrency) {
      dto.targetCurrency = RelatedCurrencyDto.fromEntity(entity.targetCurrency);
    }

    return dto;
  }

  static fromEntities(
    entities: CurrencyConverter[],
  ): CurrencyConverterPaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedCurrencyConverterDto
  implements IRelatedCurrencyConverterDto
{
  @Expose()
  readonly id!: string;

  @Expose()
  @ToDecimal()
  readonly exchangeRate!: number;

  @Expose()
  baseCurrency?: RelatedCurrencyDto;

  @Expose()
  targetCurrency?: RelatedCurrencyDto;

  static fromEntity(entity: CurrencyConverter): RelatedCurrencyConverterDto {
    const dto = plainToInstance(RelatedCurrencyConverterDto, entity);

    if (entity.baseCurrency) {
      dto.baseCurrency = RelatedCurrencyDto.fromEntity(entity.baseCurrency);
    }

    if (entity.targetCurrency) {
      dto.targetCurrency = RelatedCurrencyDto.fromEntity(entity.targetCurrency);
    }

    return dto;
  }

  static fromEntities(
    entities: CurrencyConverter[],
  ): RelatedCurrencyConverterDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
