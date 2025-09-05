import {
  compareHash,
  hash,
  paginateResponseMapper,
} from '@apps/main/common/helpers';
import { Admin } from '@apps/main/database/entities';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { FindOneOptions, Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import {
  AdminCredentialsDto,
  AdminPaginationDto,
  AdminPayloadDto,
  AuthenticatedAdminPayloadDto,
  CreateAdminDto,
  UpdateAdminDto,
} from './dto';

@Injectable()
export class AdminService {
  private _adminDetailQuery: FindOneOptions<Admin> = {
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      blogs: {
        id: true,
        title: true,
        category: {
          id: true,
          name: true,
        },
      },
    },
    relations: {
      blogs: { category: true },
    },
  };

  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async create(payload: CreateAdminDto): Promise<AdminPayloadDto> {
    const adminEntity = this.adminRepository.create({
      ...payload,
      password: await hash(payload.password),
    });

    const createdAdmin = await this.adminRepository.save(adminEntity);

    return AdminPayloadDto.fromEntity(createdAdmin);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<AdminPaginationDto[]>> {
    const paginatedAdmins = await paginate(query, this.adminRepository, {
      select: [
        'id',
        'username',
        'name',
        'email',
        'phoneNumber',
        'createdAt',

        'blogs.id',
        'blogs.title',
        'blogs.category.id',
        'blogs.category.name',
      ],
      sortableColumns: ['createdAt', 'name', 'email', 'phoneNumber'],
      defaultSortBy: [['createdAt', 'DESC']],
      nullSort: 'last',
      defaultLimit: 10,
      maxLimit: 100,
      filterableColumns: {
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],
      },
      searchableColumns: ['name', 'username', 'email', 'phoneNumber'],
      relations: {
        blogs: { category: true },
      },
    });

    const admins = AdminPaginationDto.fromEntities(paginatedAdmins.data);

    return paginateResponseMapper(paginatedAdmins, admins);
  }

  async findOne(id: string): Promise<AdminPayloadDto> {
    const admin = await this.adminRepository.findOne({
      ...this._adminDetailQuery,
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException('admin not found');
    }

    return AdminPayloadDto.fromEntity(admin);
  }

  async findOneByUsername(username: string): Promise<AdminPayloadDto> {
    const admin = await this.adminRepository.findOne({
      ...this._adminDetailQuery,
      where: { username },
    });

    if (!admin) {
      throw new NotFoundException('admin not found');
    }

    return AdminPayloadDto.fromEntity(admin);
  }

  async updateByUsername(
    username: string,
    payload: UpdateAdminDto,
  ): Promise<AdminPayloadDto> {
    await this.validateExistByUsername(username);

    await this.adminRepository.update({ username }, payload);

    return await this.findOneByUsername(username);
  }

  async updateProfile(
    id: string,
    payload: UpdateAdminDto,
  ): Promise<AdminPayloadDto> {
    await this.validateExistById(id);

    await this.adminRepository.update(id, payload);

    return await this.findOne(id);
  }

  async delete(username: string): Promise<void> {
    await this.validateExistByUsername(username);

    await this.adminRepository.delete({ username });
  }

  async validateExistById(id: string) {
    const exists = await this.adminRepository.exists({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('admin not found');
    }
  }

  async validateExistByUsername(username: string) {
    const exists = await this.adminRepository.exists({
      where: { username },
    });

    if (!exists) {
      throw new NotFoundException('admin not found');
    }
  }

  async findCredentialByIdentifier(
    identifier: string,
  ): Promise<AdminCredentialsDto> {
    const admin = await this.adminRepository.findOne({
      select: [
        'id',
        'email',
        'username',
        'phoneNumber',
        'password',
        'refreshToken',
      ],
      where: [
        { email: identifier },
        { username: identifier },
        { phoneNumber: identifier },
      ],
    });

    if (!admin) {
      throw new NotFoundException('admin not found');
    }

    return admin as AdminCredentialsDto;
  }

  async findCredentialById(id: string): Promise<AdminCredentialsDto> {
    const admin = await this.adminRepository.findOne({
      select: [
        'id',
        'email',
        'username',
        'phoneNumber',
        'password',
        'refreshToken',
      ],
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException('admin not found');
    }

    return admin as AdminCredentialsDto;
  }

  async findPayloadById(id: string): Promise<AdminPayloadDto> {
    const admin = await this.adminRepository.findOne({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
      },
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException('admin not found');
    }

    return admin as AdminPayloadDto;
  }

  async findAuthorizedAdminById(
    id: string,
  ): Promise<AuthenticatedAdminPayloadDto> {
    const admin = await this.adminRepository.findOne({
      select: ['id', 'email', 'username', 'phoneNumber', 'refreshToken'],
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException('admin not found');
    }

    if (!admin.refreshToken) {
      throw new UnauthorizedException('unauthorized admin');
    }

    return admin as AuthenticatedAdminPayloadDto;
  }

  async updatePassword(
    id: string,
    newPassword: string,
  ): Promise<AdminPayloadDto> {
    await this.validateExistById(id);

    await this.adminRepository.update(id, { password: newPassword });

    return await this.findOne(id);
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    id: string,
  ): Promise<void> {
    await this.adminRepository.update(id, {
      refreshToken: await hash(refreshToken),
    });
  }

  async removeRefreshToken(id: string): Promise<void> {
    await this.validateExistById(id);

    await this.adminRepository.update(id, {
      refreshToken: null,
    });
  }

  async findOneIfRefreshTokenMatch(
    id: string,
    refreshToken: string,
  ): Promise<AdminPayloadDto> {
    const adminCredentials = await this.findCredentialById(id);

    if (!adminCredentials) {
      throw new NotFoundException('admin not found');
    }

    if (!adminCredentials.refreshToken) {
      throw new UnauthorizedException(
        'unauthorized action, refresh token not provided',
      );
    }

    const isRefreshTokenMatch = await compareHash(
      refreshToken,
      adminCredentials.refreshToken,
    );

    if (!isRefreshTokenMatch) {
      throw new UnauthorizedException('invalid refresh token');
    }

    const adminPayload: AdminPayloadDto = {
      id: adminCredentials.id,
      username: adminCredentials.username,
      email: adminCredentials.email,
      phoneNumber: adminCredentials.phoneNumber,
    };

    return adminPayload;
  }
}
