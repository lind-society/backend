import { HalEmbedded } from '@apps/main/common/decorators';
import { PriceConverterInterceptor } from '@apps/main/common/interceptors';
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
  UseInterceptors,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { JwtAuthGuard } from '../auth/guards';
import { DeleteResponse } from '../shared/dto/custom-responses';
import {
  CreateOwnerDto,
  CreateOwnerSuccessResponse,
  GetOwnersSuccessResponse,
  GetOwnerSuccessResponse,
  UpdateOwnerDto,
  UpdateOwnerSuccessResponse,
} from './dto';
import { OwnerService } from './owner.service';

@UseGuards(JwtAuthGuard)
@HalEmbedded(
  { name: 'activities', path: 'activities' },
  { name: 'properties', path: 'properties' },
  { name: 'villas', path: 'villas' },
)
@UseInterceptors(PriceConverterInterceptor)
@Controller('owners')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Post()
  async create(@Body() payload: CreateOwnerDto) {
    const blog = await this.ownerService.create(payload);

    return new CreateOwnerSuccessResponse(blog);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const blogs = await this.ownerService.findAll(query);

    return new GetOwnersSuccessResponse(blogs);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const blog = await this.ownerService.findOne(id);

    return new GetOwnerSuccessResponse(blog);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateOwnerDto,
  ) {
    const blog = await this.ownerService.update(id, payload);

    return new UpdateOwnerSuccessResponse(blog);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.ownerService.remove(id);

    return new DeleteResponse('delete owner success');
  }
}
