import { Icon, PlaceNearby } from '@apps/main/database/entities';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class PlaceNearbyDto extends PlaceNearby {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'distance must be a valid number' },
  )
  @Min(1, { message: 'minimum distance is 1' })
  @IsNotEmpty()
  distance!: number;
}

export class IconDto extends Icon {
  @IsString()
  @IsNotEmpty()
  url!: string;

  @IsString()
  @IsNotEmpty()
  key!: string;
}
