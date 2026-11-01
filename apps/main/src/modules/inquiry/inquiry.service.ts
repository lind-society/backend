import { paginateResponseMapper } from '@apps/main/common/helpers';
import { Inquiry } from '@apps/main/database/entities';
import { MailClientService } from '@libs/mail-client';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import { CreateInquiryDto, InquiryDto, UpdateInquiryDto } from './dto';

@Injectable()
export class InquiryService {
  private readonly logger = new Logger(InquiryService.name);

  constructor(
    @InjectRepository(Inquiry)
    private inquiryRepository: Repository<Inquiry>,
    private mailClientService: MailClientService,
    private configService: ConfigService,
  ) {}

  async create(payload: CreateInquiryDto): Promise<InquiryDto> {
    const inquiry = await this.inquiryRepository.save(
      this.inquiryRepository.create({
        ...payload,
        phone: payload.phone ?? null,
        message: payload.message ?? null,
        referenceId: payload.referenceId ?? null,
        referenceName: payload.referenceName ?? null,
        metadata: payload.metadata ?? null,
      }),
    );

    // The visitor's message is already safe in the database; a mail outage
    // must not turn a stored inquiry into an error page.
    void this.notifyTeam(inquiry);

    return InquiryDto.fromEntity(inquiry);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<InquiryDto[]>> {
    const paginated = await paginate(query, this.inquiryRepository, {
      sortableColumns: ['createdAt', 'name', 'status', 'type'],
      defaultSortBy: [['createdAt', 'DESC']],
      nullSort: 'last',
      defaultLimit: 10,
      maxLimit: 100,
      filterableColumns: {
        type: true,
        status: true,
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],
      },
      searchableColumns: ['name', 'email', 'phone', 'message', 'referenceName'],
    });

    return paginateResponseMapper(
      paginated,
      InquiryDto.fromEntities(paginated.data),
    );
  }

  async findOne(id: string): Promise<InquiryDto> {
    const inquiry = await this.inquiryRepository.findOne({ where: { id } });

    if (!inquiry) {
      throw new NotFoundException('inquiry not found');
    }

    return InquiryDto.fromEntity(inquiry);
  }

  async update(id: string, payload: UpdateInquiryDto): Promise<InquiryDto> {
    await this.validateExist(id);

    await this.inquiryRepository.update(id, { status: payload.status });

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.validateExist(id);

    await this.inquiryRepository.softDelete(id);
  }

  private async validateExist(id: string): Promise<void> {
    const exists = await this.inquiryRepository.exists({ where: { id } });

    if (!exists) {
      throw new NotFoundException('inquiry not found');
    }
  }

  private async notifyTeam(inquiry: Inquiry): Promise<void> {
    const to = this.configService.get<string>('MAIL_SENDER_EMAIL');

    if (!to) {
      return;
    }

    try {
      await this.mailClientService.sendMail({
        to,
        subject: `New ${inquiry.type.replace('_', ' ')} inquiry from ${inquiry.name}`,
        template: 'inquiry',
        context: {
          type: inquiry.type,
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          message: inquiry.message,
          referenceName: inquiry.referenceName,
          metadata: inquiry.metadata,
        },
        source: 'inquiry-notification',
      });
    } catch (error) {
      this.logger.warn(
        `could not email inquiry ${inquiry.id}: ${(error as Error).message}`,
      );
    }
  }
}
