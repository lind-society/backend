import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { FacilityCategoryService } from './facility-category.service';
import {
  CreateFacilityCategoryDto,
  CreateFacilityCategorySuccessResponse,
  FacilityCategoryParamsDto,
  GetFacilityCategoriesSuccessResponse,
  GetFacilityCategoriesPaginateDto,
  GetFacilityCategorySuccessResponse,
  UpdateFacilityCategorySuccessResponse,
  UpdateFacilityCategoryDto,
} from './dto';
import { UpdateFacilityDto } from '../dto';
import { DeleteResponse } from 'src/modules/shared/dto';

@Controller('facility-category')
export class FacilityCategoryController {
  constructor(
    private readonly facilityCategoryService: FacilityCategoryService,
  ) {}

  @Post()
  async create(@Body() payload: CreateFacilityCategoryDto) {
    try {
      const facilityCategory =
        await this.facilityCategoryService.create(payload);

      return new CreateFacilityCategorySuccessResponse(facilityCategory);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    try {
      const categories = await this.facilityCategoryService.findAll(query);

      return new GetFacilityCategoriesSuccessResponse(categories);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param() params: FacilityCategoryParamsDto) {
    try {
      const facilityCategory = await this.facilityCategoryService.findOne(
        params.id,
      );

      return new GetFacilityCategorySuccessResponse(facilityCategory);
    } catch (error) {
      console.error(error);

      throw error;
    }
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
    try {
      await this.facilityCategoryService.remove(params.id);

      return new DeleteResponse('delete facility category success');
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
