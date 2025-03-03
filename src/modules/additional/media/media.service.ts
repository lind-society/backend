import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { Media } from 'src/database/entities';
import { PaginateResponseDataProps } from 'src/modules/shared/dto';
import { Repository } from 'typeorm';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediaDto, MediaWithRelationsDto } from './dto/media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}
  async create(payload: CreateMediaDto): Promise<MediaDto> {
    const media = this.mediaRepository.create(payload);

    return await this.mediaRepository.save(media);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<MediaWithRelationsDto[]>> {
    const paginatedMediaCategory = await paginate(query, this.mediaRepository, {
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      defaultLimit: 10,
      relations: { additional: true },
    });

    return paginateResponseMapper(paginatedMediaCategory);
  }

  async findOne(id: string): Promise<MediaWithRelationsDto> {
    const media = await this.mediaRepository.findOne({
      where: {
        id,
      },
      relations: {
        additional: true,
      },
    });

    if (!media) {
      throw new NotFoundException('media not found');
    }

    return media;
  }

  async update(
    id: string,
    payload: UpdateMediaDto,
  ): Promise<MediaWithRelationsDto> {
    await this.findOne(id);

    await this.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.remove(id);
  }
}
