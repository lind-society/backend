import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import {
  Activity,
  ActivityBooking,
  ActivityBookingStatus,
  Review,
  Villa,
  VillaBooking,
  VillaBookingStatus,
} from 'src/database/entities';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ActivityService } from '../activity/activity.service';
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
    private villaService: VillaService,
  ) {}
  async create(payload: CreateReviewDto): Promise<ReviewWithRelationsDto> {
    return this.dataSource.transaction(async (manager) => {
      await this._validateBookingStatus(
        manager,
        payload.activityBookingId,
        payload.villaBookingId,
      );

      const review = this.reviewRepository.create(payload);

      const createdReview = await manager.save(Review, review);

      await this._validateRelatedEntities(
        manager,
        payload.activityId,
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
        activityBookingId: [FilterOperator.EQ],
        villaBookingId: [FilterOperator.EQ],
        activityId: [FilterOperator.EQ],
        villaId: [FilterOperator.EQ],
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],
      },
      searchableColumns: [
        'activityBooking.customer.name',
        'villaBooking.customer.name',
        'activity.name',
        'villa.name',
      ],
      relations: {
        activityBooking: {
          customer: true,
          currency: true,
        },
        villaBooking: {
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
        activityBooking: {
          customer: true,
          currency: true,
        },
        villaBooking: {
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
        initialReview.villaId,
      );
    });

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.reviewRepository.delete(id);
  }

  private async _validateBookingStatus(
    manager: EntityManager,
    activityBookingId?: string,
    villaBookingId?: string,
  ): Promise<void> {
    if (activityBookingId) {
      const activityBooking = await manager.findOne(ActivityBooking, {
        where: { id: activityBookingId },
        select: ['status'],
      });

      if (activityBooking.status !== ActivityBookingStatus.Completed) {
        throw new BadRequestException(
          'Activity booking status must be completed to add review',
        );
      }
    }

    if (villaBookingId) {
      const villaBooking = await manager.findOne(VillaBooking, {
        where: { id: villaBookingId },
        select: ['status'],
      });

      if (villaBooking.status !== VillaBookingStatus.Done) {
        throw new BadRequestException(
          'Villa booking status must be done to add review',
        );
      }
    }
  }

  private async _validateRelatedEntities(
    manager: EntityManager,
    activityId?: string,
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
