import { Admin } from '@apps/main/database/entities';
import { BlogDto } from '@apps/main/modules/blog/dto';
import { Exclude, Expose } from 'class-transformer';

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

export interface IAdminWithRelationDto extends IAdminDto {
  blogs: BlogDto[];
}

export class AdminCredentialsDto implements IAdminCredentialsDto {
  readonly id!: string;
  readonly username!: string;
  readonly email!: string;
  readonly phoneNumber!: string;
  readonly password!: string;
  readonly refreshToken!: string;
}

export class AuthenticatedAdminPayloadDto
  implements IAuthenticatedAdminPayloadDto
{
  readonly id!: string;
  readonly username!: string;
  readonly email!: string;
  readonly phoneNumber!: string;
  readonly refreshToken!: string;
}

export class AdminPayloadDto implements IAdminPayloadDto {
  readonly id!: string;
  readonly username!: string;
  readonly email!: string;
  readonly phoneNumber!: string;
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

  @Expose()
  readonly createdAt!: Date;

  @Expose()
  readonly updatedAt!: Date | null;

  @Expose()
  readonly deletedAt!: Date | null;

  @Exclude()
  readonly password!: string;

  @Exclude()
  readonly refreshToken!: string;
}

export class AdminWithRelationDto
  extends AdminDto
  implements IAdminWithRelationDto
{
  @Expose()
  readonly blogs: BlogDto[];
}
