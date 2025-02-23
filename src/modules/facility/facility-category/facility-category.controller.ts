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
import { DeleteResponse } from 'src/modules/shared/dto';
import {
  CreateFacilityCategoryDto,
  CreateFacilityCategorySuccessResponse,
  FacilityCategoryParamsDto,
  GetFacilityCategoriesSuccessResponse,
  GetFacilityCategorySuccessResponse,
  UpdateFacilityCategoryDto,
  UpdateFacilityCategorySuccessResponse,
} from './dto';
import { FacilityCategoryService } from './facility-category.service';

@Controller('facility-categories')
export class FacilityCategoryController {
  constructor(
    private readonly facilityCategoryService: FacilityCategoryService,
  ) {}

  @Post()
  async create(@Body() payload: CreateFacilityCategoryDto) {
    const facilityCategory = await this.facilityCategoryService.create(payload);

    return new CreateFacilityCategorySuccessResponse(facilityCategory);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const categories = await this.facilityCategoryService.findAll(query);

    return new GetFacilityCategoriesSuccessResponse(categories);
  }

  @Get(':id')
  async findOne(@Param() params: FacilityCategoryParamsDto) {
    const facilityCategory = await this.facilityCategoryService.findOne(
      params.id,
    );

    return new GetFacilityCategorySuccessResponse(facilityCategory);
  }

  @Patch(':id')
  async update(
    @Param() params: FacilityCategoryParamsDto,
    @Body() updateFacilityDto: UpdateFacilityCategoryDto,
  ) {
    const facilityCategory = await this.facilityCategoryService.update(
      params.id,
      updateFacilityDto,
    );

    return new UpdateFacilityCategorySuccessResponse(facilityCategory);
  }

  @Delete(':id')
  async remove(@Param() params: FacilityCategoryParamsDto) {
    await this.facilityCategoryService.remove(params.id);

    return new DeleteResponse('delete facility category success');
  }
}
