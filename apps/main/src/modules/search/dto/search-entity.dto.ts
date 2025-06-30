export interface ISearchEntityDto {
  name: string;
  secondaryName: string;
  highlight: string;
  country: string;
  city: string;
  state: string;
  isFavorite: string;
}

export class SearchEntityDto implements ISearchEntityDto {
  readonly name!: string;
  readonly secondaryName!: string;
  readonly highlight!: string;
  readonly country!: string;
  readonly city!: string;
  readonly state!: string;
  readonly isFavorite!: string;
}
