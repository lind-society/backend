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
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Public } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards';
import { DeleteResponse } from '../shared/dto/custom-responses';
import {
  CreatePropertyDto,
  CreatePropertySuccessResponse,
  GetPropertiesSuccessResponse,
  GetPropertySuccessResponse,
  UpdatePropertyDto,
  UpdatePropertySuccessResponse,
} from './dto';
import { PropertyService } from './property.service';

@UseGuards(JwtAuthGuard)
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  async create(@Body() payload: CreatePropertyDto) {
    const result = await this.propertyService.create(payload);

    return new CreatePropertySuccessResponse(result);
  }

  @Public()
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.propertyService.findAll(query);

    return new GetPropertiesSuccessResponse(result);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.propertyService.findOne(id);

    return new GetPropertySuccessResponse(result);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdatePropertyDto,
  ) {
    const result = await this.propertyService.update(id, payload);

    return new UpdatePropertySuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.propertyService.remove(id);

    return new DeleteResponse('delete property success');
  }
}
