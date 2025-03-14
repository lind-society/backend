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
  GetVillaParamsDto,
  GetVillasSuccessResponse,
  GetVillaSuccessResponse,
} from './dto';
import {
  CreateVillaDto,
  CreateVillaSuccessResponse,
} from './dto/create-villa.dto';
import {
  UpdateVillaDto,
  UpdateVillaSuccessResponse,
} from './dto/update-villa.dto';
import { VillaService } from './villa.service';

@Controller('villas')
export class VillaController {
  constructor(private readonly villaService: VillaService) {}

  @Post()
  async create(@Body() payload: CreateVillaDto) {
    const result = await this.villaService.create(payload);

    return new CreateVillaSuccessResponse(result);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.villaService.findAll(query);

    return new GetVillasSuccessResponse(result);
  }

  @Get(':id')
  async findOne(@Param() params: GetVillaParamsDto) {
    const result = await this.villaService.findOne(params.id);

    return new GetVillaSuccessResponse(result);
  }

  @Patch(':id')
  async update(
    @Param() params: GetVillaParamsDto,
    @Body() payload: UpdateVillaDto,
  ) {
    const result = await this.villaService.update(params.id, payload);

    return new UpdateVillaSuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param() params: GetVillaParamsDto) {
    await this.villaService.remove(params.id);

    return new DeleteResponse('delete villa success');
  }
}
