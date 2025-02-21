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
import { FacilityCategoryService } from './facility-category.service';
import {
  CreateFacilityCategoryDto,
  CreateFacilityCategorySuccessResponse,
} from './dto/create-facility-category.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import {
  FacilityCategoryIdDto,
  GetFacilityCategoriesSuccessResponse,
  GetFacilityCategorysDtoPaginateQuery,
  GetFacilityCategorySuccessResponse,
} from './dto/get-facility-category.dto';
import { UpdateFacilityDto } from '../dto';
import { UpdateFacilityCategorySuccessResponse } from './dto';
import { DeleteResponse } from 'src/modules/shared/dto/delete-response.dto';

@Controller('facility/category')
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
  async findAll(
    @Query() query: GetFacilityCategorysDtoPaginateQuery,
    @Paginate() paginateQuery: PaginateQuery
  ) {
    console.log('woi');
    try {
      console.log(query);
      console.log(paginateQuery);
      const facilityCategories = await this.facilityCategoryService.findAll({
        ...query,
        ...paginateQuery,
      });

      return new GetFacilityCategoriesSuccessResponse(facilityCategories);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param() params: FacilityCategoryIdDto) {
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
    @Param() params: FacilityCategoryIdDto,
    @Body() updateFacilityDto: UpdateFacilityDto,
  ) {
    const facilityCategory = await this.facilityCategoryService.update(
      params.id,
      updateFacilityDto,
    );

    return new UpdateFacilityCategorySuccessResponse(facilityCategory);
  }

  @Delete(':id')
  async remove(@Param() params: FacilityCategoryIdDto) {
    try {
      await this.facilityCategoryService.remove(params.id);

      return new DeleteResponse('delete facility category success');
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
