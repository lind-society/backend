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
  CreateFacilityDto,
  CreateFacilitySuccessResponse,
  GetFacilitiesSuccessResponse,
  GetFacilityParamsDto,
  GetFacilitySuccessResponse,
  UpdateFacilityDto,
  UpdateFacilitySuccessResponse,
} from './dto';
import { FacilityService } from './facility.service';

@Controller('facilities')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Post()
  async create(@Body() payload: CreateFacilityDto) {
    const facility = await this.facilityService.create(payload);

    return new CreateFacilitySuccessResponse(facility);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const facilities = await this.facilityService.findAll(query);

    return new GetFacilitiesSuccessResponse(facilities);
  }

  @Get(':id')
  async findOne(@Param() params: GetFacilityParamsDto) {
    const facility = await this.facilityService.findOne(params.id);

    return new GetFacilitySuccessResponse(facility);
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
    await this.facilityService.remove(params.id);

    return new DeleteResponse('delete facility success');
  }
}
