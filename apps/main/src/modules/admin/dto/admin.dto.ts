import { Admin, Blog } from '@apps/main/database/entities';
import {
  BlogWithRelationsDto,
  RelatedBlogDto,
} from '@apps/main/modules/blog/dto';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

export interface IAdminCredentialsDto
  extends Pick<
    Admin,
    'id' | 'username' | 'email' | 'phoneNumber' | 'password'
  > {}

export interface IAuthenticatedAdminPayloadDto
  extends Pick<
    Admin,
    'id' | 'username' | 'email' | 'phoneNumber' | 'refreshToken'
  > {}

export interface IAdminPayloadDto
  extends Pick<Admin, 'id' | 'username' | 'email' | 'phoneNumber'> {}

export interface IAdminDto
  extends Omit<Admin, 'password' | 'refreshToken' | 'blogs'> {}

export interface IAdminWithRelationsDto extends IAdminDto {
  blogs?: BlogWithRelationsDto[];
}

export interface IAdminPaginationDto
  extends Omit<
    Admin,
    'password' | 'refreshToken' | 'updatedAt' | 'deletedAt' | 'blogs'
  > {
  blogs?: RelatedBlogDto[];
}

export interface IRelatedAdminDto extends Pick<Admin, 'id' | 'name'> {}

export class AdminCredentialsDto implements IAdminCredentialsDto {
  readonly id!: string;
  readonly username!: string;
  readonly email!: string;
  readonly phoneNumber!: string;
  readonly password!: string;
  readonly refreshToken!: string | null;

  static fromEntity(entity: Admin): AdminCredentialsDto {
    return plainToInstance(AdminCredentialsDto, entity);
  }

  static fromEntities(entities: Admin[]): AdminCredentialsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class AuthenticatedAdminPayloadDto
  implements IAuthenticatedAdminPayloadDto
{
  readonly id!: string;
  readonly username!: string;
  readonly email!: string;
  readonly phoneNumber!: string;
  readonly refreshToken!: string | null;

  static fromEntity(entity: Admin): AuthenticatedAdminPayloadDto {
    return plainToInstance(AuthenticatedAdminPayloadDto, entity);
  }

  static fromEntities(entities: Admin[]): AuthenticatedAdminPayloadDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class AdminPayloadDto implements IAdminPayloadDto {
  readonly id!: string;
  readonly username!: string;
  readonly email!: string;
  readonly phoneNumber!: string;

  static fromEntity(entity: Admin): AdminPayloadDto {
    return plainToInstance(AdminPayloadDto, entity);
  }

  static fromEntities(entities: Admin[]): AdminPayloadDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class AdminDto implements IAdminDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly username!: string;

  @Expose()
  readonly email!: string;

  @Expose()
  readonly phoneNumber!: string;

  @Exclude()
  readonly password!: string;

  @Exclude()
  readonly refreshToken!: string | null;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: Admin): AdminDto {
    return plainToInstance(AdminDto, entity);
  }

  static fromEntities(entities: Admin[]): AdminDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class AdminWithRelationsDto
  extends AdminDto
  implements IAdminWithRelationsDto
{
  @Expose()
  blogs?: BlogWithRelationsDto[];

  static fromEntity(entity: Admin & { blogs?: Blog[] }): AdminWithRelationsDto {
    const dto = plainToInstance(AdminWithRelationsDto, entity);

    if (entity.blogs) {
      dto.blogs = BlogWithRelationsDto.fromEntities(entity.blogs);
    }

    return dto;
  }

  static fromEntities(
    entities: (Admin & { blogs: Blog[] })[],
  ): AdminWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class AdminPaginationDto implements IAdminPaginationDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly username!: string;

  @Expose()
  readonly email!: string;

  @Expose()
  readonly phoneNumber!: string;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  blogs!: RelatedBlogDto[];

  static fromEntity(entity: Admin & { blogs?: Blog[] }): AdminPaginationDto {
    const dto = plainToInstance(AdminPaginationDto, entity);

    if (entity.blogs) {
      dto.blogs = RelatedBlogDto.fromEntities(entity.blogs);
    }

    return dto;
  }

  static fromEntities(
    entities: (Admin & { blogs: Blog[] })[],
  ): AdminPaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedAdminDto implements IRelatedAdminDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  static fromEntity(entity: Admin): RelatedAdminDto {
    return plainToInstance(RelatedAdminDto, entity);
  }

  static fromEntities(entities: Admin[]): RelatedAdminDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
