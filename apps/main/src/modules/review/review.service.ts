import { paginateResponseMapper } from '@apps/main/common/helpers';
import {
  Activity,
  Property,
  Review,
  Villa,
} from '@apps/main/database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ActivityService } from '../activity/activity.service';
import { PropertyService } from '../property/property.service';
import { PaginateResponseDataProps } from '../shared/dto';
import { VillaService } from '../villa/villa.service';
import {
  CreateReviewDto,
  ReviewDto,
  ReviewWithRelationsDto,
  UpdateReviewDto,
} from './dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private activityService: ActivityService,
    private propertyService: PropertyService,
    private villaService: VillaService,
  ) {}
  async create(payload: CreateReviewDto): Promise<ReviewWithRelationsDto> {
    return this.dataSource.transaction(async (manager) => {
      const review = this.reviewRepository.create(payload);

      const createdReview = await manager.save(Review, review);

      await this._validateRelatedEntities(
        manager,
        payload.activityId,
        payload.propertyId,
        payload.villaId,
      );

      return createdReview;
    });
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<ReviewWithRelationsDto[]>> {
    const paginatedReview = await paginate(query, this.reviewRepository, {
      sortableColumns: ['createdAt', 'rating'],
      defaultSortBy: [['createdAt', 'DESC']],
      nullSort: 'last',
      defaultLimit: 10,
      maxLimit: 100,
      filterableColumns: {
        rating: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
        bookingId: [FilterOperator.EQ],
        activityId: [FilterOperator.EQ],
        propertyId: [FilterOperator.EQ],
        villaId: [FilterOperator.EQ],
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],
      },
      searchableColumns: [
        'booking.customer.name',
        'activity.name',
        'property.name',
        'villa.name',
      ],
      relations: {
        booking: {
          customer: true,
          currency: true,
        },
        activity: {
          owner: true,
          currency: true,
        },
        villa: {
          owner: true,
          currency: true,
        },
        property: {
          owner: true,
          currency: true,
        },
      },
    });

    return paginateResponseMapper(paginatedReview);
  }

  async findOne(id: string, entityManager?: EntityManager) {
    const repository = entityManager
      ? entityManager.getRepository(Review)
      : this.reviewRepository;

    const review = await repository.findOne({
      where: {
        id,
      },
      relations: {
        booking: {
          customer: true,
          currency: true,
        },
        activity: {
          owner: true,
          currency: true,
        },
        villa: {
          owner: true,
          currency: true,
        },
        property: {
          owner: true,
          currency: true,
        },
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
    await this.dataSource.transaction(async (manager) => {
      const initialReview = await this.findOne(id, manager);

      await manager.update(Review, id, payload);

      await this._validateRelatedEntities(
        manager,
        initialReview.activityId,
        initialReview.propertyId,
        initialReview.villaId,
      );
    });

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.reviewRepository.delete(id);
  }

  private async _validateRelatedEntities(
    manager: EntityManager,
    activityId?: string,
    propertyId?: string,
    villaId?: string,
  ): Promise<void> {
    if (activityId) {
      await this.activityService.findOne(activityId, manager);

      const reviews = await manager.find(Review, {
        where: { activityId },
        select: ['rating'],
      });

      const averageRating = this._calculateAverageRating(reviews);

      await manager.update(Activity, activityId, { averageRating });
    }

    if (propertyId) {
      await this.propertyService.findOne(propertyId, manager);

      const reviews = await manager.find(Review, {
        where: { propertyId },
        select: ['rating'],
      });

      const averageRating = this._calculateAverageRating(reviews);

      await manager.update(Property, propertyId, { averageRating });
    }

    if (villaId) {
      await this.villaService.findOne(villaId, manager);

      const reviews = await manager.find(Review, {
        where: { villaId },
        select: ['rating'],
      });

      const averageRating = this._calculateAverageRating(reviews);

      await manager.update(Villa, villaId, { averageRating });
    }
  }

  private _calculateAverageRating(reviews: ReviewDto[]): number {
    return reviews.length > 0
      ? reviews.reduce(
          (sum: number, review: ReviewDto) =>
            sum + parseFloat(review.rating.toString()),
          0,
        ) / reviews.length
      : 0;
  }
}
