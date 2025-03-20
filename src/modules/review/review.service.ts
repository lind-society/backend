import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { Review } from 'src/database/entities';
import { Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import { VillaService } from '../villa/villa.service';
import {
  CreateReviewDto,
  GetReviewsDto,
  ReviewWithRelationsDto,
  UpdateReviewDto,
} from './dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private villaService: VillaService,
  ) {}
  async create(payload: CreateReviewDto): Promise<ReviewWithRelationsDto> {
    await this._validateVilla(payload.villaId);

    const review = this.reviewRepository.create(payload);

    return await this.reviewRepository.save(review);
  }

  async findAll(
    query: PaginateQuery,
    payload: GetReviewsDto,
  ): Promise<PaginateResponseDataProps<ReviewWithRelationsDto[]>> {
    const whereCondition = payload.villaId
      ? { villaId: payload.villaId }
      : undefined;

    const paginatedVilla = await paginate(query, this.reviewRepository, {
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      defaultLimit: 10,
      searchableColumns: [
        'name',
        'activity.name',
        'property.name',
        'villa.name',
      ],
      where: whereCondition,
      relations: {
        activity: true,
        villa: true,
        property: true,
      },
    });

    return paginateResponseMapper(paginatedVilla);
  }

  async findOne(id: string) {
    const review = await this.reviewRepository.findOne({
      where: {
        id,
      },
      relations: {
        villa: true,
      },
    });

    if (!review) {
      throw new NotFoundException('review not found');
    }

    return review;
  }

  async update(
    id: string,
    payload: UpdateReviewDto,
  ): Promise<ReviewWithRelationsDto> {
    await this.findOne(id);

    await this.reviewRepository.update(id, payload);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.reviewRepository.delete(id);
  }

  private async _validateVilla(villaId: string): Promise<void> {
    const validCategory = await this.villaService.findOne(villaId);

    if (!validCategory) {
      throw new NotFoundException('Blog category not found');
    }
  }
}
