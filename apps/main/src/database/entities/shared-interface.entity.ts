// class used as an interface since interface and type are erased at runtime

import { Expose, Transform } from 'class-transformer';

export class PlaceNearby {
  @Expose()
  name!: string;

  @Expose()
  @Transform(({ value }) => parseFloat(value))
  distance!: number;
}

export class Icon {
  @Expose()
  url!: string;

  @Expose()
  key!: string;
}
