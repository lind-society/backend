import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { FacilityService } from './facility.service';
import {
  CreateFacilityDto,
  CreateFacilitySuccessResponse,
  GetFacilitiesDto,
  GetFacilitiesSuccessResponse,
  GetFacilityParamsDto,
  GetFacilitySuccessResponse,
  UpdateFacilityDto,
  UpdateFacilitySuccessResponse,
} from './dto';
import { DeleteResponse } from '../shared/dto';

@Controller('facility')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Post()
  async create(@Body() payload: CreateFacilityDto) {
    try {
      const facility = await this.facilityService.create(payload);

      return new CreateFacilitySuccessResponse(facility);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
    @Body() payload: GetFacilitiesDto,
  ) {
    try {
      const facilities = await this.facilityService.findAll(query, payload);

      return new GetFacilitiesSuccessResponse(facilities);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param() params: GetFacilityParamsDto) {
    try {
      const facility = await this.facilityService.findOne(params.id);

      return new GetFacilitySuccessResponse(facility);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param() params: GetFacilityParamsDto,
    @Body() updateFacilityDto: UpdateFacilityDto,
  ) {
    const facility = await this.facilityService.update(
      params.id,
      updateFacilityDto,
    );

    return new UpdateFacilitySuccessResponse(facility);
  }

  @Delete(':id')
  async remove(@Param() params: GetFacilityParamsDto) {
    try {
      await this.facilityService.remove(params.id);

      return new DeleteResponse('delete facility success');
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
