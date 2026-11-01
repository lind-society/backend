import { Public } from '@apps/main/common/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { JwtAuthGuard } from '../auth/guards';
import { DeleteResponse } from '../shared/dto/custom-responses';
import {
  CreateInquiryDto,
  CreateInquirySuccessResponse,
  GetInquiriesSuccessResponse,
  GetInquirySuccessResponse,
  UpdateInquiryDto,
  UpdateInquirySuccessResponse,
} from './dto';
import { InquiryService } from './inquiry.service';

@UseGuards(JwtAuthGuard)
@Controller('inquiries')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  // Open to visitors, so it gets a much tighter limit than the global one.
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  async create(@Body() payload: CreateInquiryDto) {
    const result = await this.inquiryService.create(payload);

    return new CreateInquirySuccessResponse(result);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.inquiryService.findAll(query);

    return new GetInquiriesSuccessResponse(result);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.inquiryService.findOne(id);

    return new GetInquirySuccessResponse(result);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateInquiryDto,
  ) {
    const result = await this.inquiryService.update(id, payload);

    return new UpdateInquirySuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.inquiryService.remove(id);

    return new DeleteResponse('delete inquiry success');
  }
}
