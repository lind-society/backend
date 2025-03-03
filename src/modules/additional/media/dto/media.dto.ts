import { Media } from 'src/database/entities';
import { AdditionalDto } from '../../dto/additional.dto';

export interface IMediaDto extends Omit<Media, 'additional'> {}

export interface IMediaWithRelationsDto extends IMediaDto {
  additional: AdditionalDto;
}

export class MediaDto implements IMediaDto {
  readonly id!: string;
  readonly photo!: string | null;
  readonly video!: string | null;
  readonly video360!: string | null;
  readonly additionalId!: string | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class MediaWithRelationsDto
  extends MediaDto
  implements IMediaWithRelationsDto
{
  readonly additional!: AdditionalDto;
}
