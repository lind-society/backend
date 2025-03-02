import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BlogCategory } from 'src/database/entities';
import { BlogDto } from '../../dto';

export interface IBlogCategoryDto
  extends Pick<
    BlogCategory,
    'id' | 'name' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

export interface IBlogCategoryWithRelationsDto extends IBlogCategoryDto {
  facilities: BlogDto[];
}

export class BlogCategoryDto implements IBlogCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  readonly id!: string;

  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsDate()
  @IsNotEmpty()
  readonly createdAt!: Date;

  @IsDate()
  @IsOptional()
  readonly updatedAt!: Date | null;

  @IsDate()
  @IsOptional()
  readonly deletedAt!: Date | null;
}

export class BlogCategoryWithRelationsDto
  extends BlogCategoryDto
  implements IBlogCategoryDto
{
  readonly blogs?: BlogDto[];
}
