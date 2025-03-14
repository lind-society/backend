import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { compareHash, hash, paginateResponseMapper } from 'src/common/helpers';
import { Admin } from 'src/database/entities';
import { Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import {
  AdminCredentialsDto,
  AdminPayloadDto,
  AdminWithRelationDto,
  CreateAdminDto,
  UpdateAdminDto,
} from './dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}
  async create(payload: CreateAdminDto): Promise<AdminWithRelationDto> {
    const admin = this.adminRepository.create({
      ...payload,
      password: await hash(payload.password),
    });

    return await this.adminRepository.save(admin);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<AdminWithRelationDto[]>> {
    const paginatedAdmin = await paginate(query, this.adminRepository, {
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      defaultLimit: 10,
      searchableColumns: ['name', 'username', 'email', 'phoneNumber'],
      relations: {
        blogs: true,
      },
    });

    const transformedAdmin = paginatedAdmin.data.map((admin) =>
      plainToInstance(AdminWithRelationDto, admin, {
        excludeExtraneousValues: true,
      }),
    );

    return paginateResponseMapper(paginatedAdmin, transformedAdmin);
  }

  async findOne(id: string): Promise<AdminWithRelationDto> {
    const admin = await this.adminRepository.findOne({
      where: {
        id,
      },
      relations: {
        blogs: true,
      },
    });

    const result = plainToInstance(AdminWithRelationDto, admin, {
      excludeExtraneousValues: true,
    });

    return result;
  }

  async findOneByUsername(username: string): Promise<AdminWithRelationDto> {
    const admin = await this.adminRepository.findOne({
      where: {
        username,
      },
      relations: {
        blogs: true,
      },
    });

    console.log({ username });

    if (!admin) {
      throw new NotFoundException('admin not found');
    }

    const result = plainToInstance(AdminWithRelationDto, admin, {
      excludeExtraneousValues: true,
    });

    return result;
  }

  async updateByUsername(
    username: string,
    payload: UpdateAdminDto,
  ): Promise<AdminWithRelationDto> {
    const initialAdmin = await this.findOneByUsername(username);

    await this.adminRepository.update({ username }, payload);

    return await this.findOne(initialAdmin.id);
  }

  async updateProfile(
    id: string,
    payload: UpdateAdminDto,
  ): Promise<AdminWithRelationDto> {
    await this.findOne(id);

    await this.adminRepository.update(id, payload);

    return await this.findOne(id);
  }

  async delete(username: string): Promise<void> {
    await this.findOneByUsername(username);

    await this.adminRepository.delete({ username });
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
      select: ['id', 'email', 'username', 'phoneNumber'],
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException('admin not found');
    }

    return admin as AdminPayloadDto;
  }

  async updatePassword(
    id: string,
    newPassword: string,
  ): Promise<AdminWithRelationDto> {
    await this.findOne(id);

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
    await this.findOne(id);

    await this.adminRepository.update(id, {
      refreshToken: null,
    });
  }

  async findOneIfRefreshTokenMatch(id: string, refreshToken: string) {
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
