import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { GetPropertyParamsDto } from './dto/get-property.dto';
import { PropertyService } from './property.service';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  async create(@Body() payload: CreatePropertyDto) {
    console.log({ payload });
    const result = await this.propertyService.create(payload);

    return result;
  }

  @Get(':id')
  async findOne(@Param() params: GetPropertyParamsDto) {
    const result = await this.propertyService.findOne(params.id);

    return result;
  }
}
