import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { DeleteResponse } from '../shared/dto/custom-responses';
import {
  CreatePropertyDto,
  CreatePropertySuccessResponse,
} from './dto/create-property.dto';
import {
  GetPropertiesSuccessResponse,
  GetPropertyParamsDto,
  GetPropertySuccessResponse,
} from './dto/get-property.dto';
import {
  UpdatePropertyDto,
  UpdatePropertySuccessResponse,
} from './dto/update-property.dto';
import { PropertyService } from './property.service';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  async create(@Body() payload: CreatePropertyDto) {
    console.log({ payload });
    const result = await this.propertyService.create(payload);

    return new CreatePropertySuccessResponse(result);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.propertyService.findAll(query);

    return new GetPropertiesSuccessResponse(result);
  }

  @Get(':id')
  async findOne(@Param() params: GetPropertyParamsDto) {
    const result = await this.propertyService.findOne(params.id);

    return new GetPropertySuccessResponse(result);
  }

  @Patch(':id')
  async update(
    @Param() params: GetPropertyParamsDto,
    @Body() payload: UpdatePropertyDto,
  ) {
    const result = await this.propertyService.update(params.id, payload);

    return new UpdatePropertySuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param() params: GetPropertyParamsDto) {
    await this.propertyService.remove(params.id);

    return new DeleteResponse('delete property success');
  }
}
