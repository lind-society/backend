import { Currency } from '@apps/main/database/entities';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

export interface ICurrencyDto extends Currency {}

export interface ICurrencyPaginationDto
  extends Pick<
    Currency,
    | 'id'
    | 'name'
    | 'code'
    | 'symbol'
    | 'allowDecimal'
    | 'allowRound'
    | 'createdAt'
  > {}

export interface IRelatedCurrencyDto
  extends Pick<Currency, 'id' | 'name' | 'code' | 'symbol'> {}

export class CurrencyDto implements ICurrencyDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly code!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly symbol!: string | null;

  @Expose()
  readonly allowDecimal!: boolean | null;

  @Expose()
  readonly allowRound!: boolean | null;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: Currency): CurrencyDto {
    return plainToInstance(CurrencyDto, entity);
  }

  static fromEntities(entities: Currency[]): CurrencyDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class CurrencyPaginationDto implements ICurrencyPaginationDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly code!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly symbol!: string | null;

  @Expose()
  readonly allowDecimal!: boolean | null;

  @Expose()
  readonly allowRound!: boolean | null;

  @Exclude()
  readonly createdAt!: Date;

  static fromEntity(entity: Currency): CurrencyPaginationDto {
    return plainToInstance(CurrencyPaginationDto, entity);
  }

  static fromEntities(entities: Currency[]): CurrencyPaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedCurrencyDto implements IRelatedCurrencyDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly code!: string;

  @Expose()
  readonly symbol!: string;

  static fromEntity(entity: Currency): RelatedCurrencyDto {
    return plainToInstance(RelatedCurrencyDto, entity);
  }

  static fromEntities(entities: Currency[]): RelatedCurrencyDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
