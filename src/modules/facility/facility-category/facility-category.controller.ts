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
import { CreateFacilityCategoryDto } from './dto/create-facility-category.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('facility/category')
export class FacilityCategoryController {
  constructor(
    private readonly facilityCategoryService: FacilityCategoryService,
  ) {}

  @Post()
  create(@Body() payload: CreateFacilityCategoryDto) {
    return this.facilityCategoryService.create(payload);
  }

  @Get()
  findAll(
    @Query() query: GetTagsDtoPaginateQuery,
    @Paginate() paginateQuery: PaginateQuery,
  ) {
    return this.facilityCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facilityCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFacilityDto: UpdateFacilityDto,
  ) {
    return this.facilityCategoryService.update(id, updateFacilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facilityCategoryService.remove(id);
  }
}
