import { JwtAuthGuard } from '@apps/main/modules/auth/guards';
import { DeleteResponse } from '@apps/main/modules/shared/dto/custom-responses';
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
import {
  CreateVillaPolicyTypeDto,
  CreateVillaPolicyTypeSuccessResponse,
  GetVillaPolicyTypesSuccessResponse,
  GetVillaPolicyTypeSuccessResponse,
  UpdateVillaPolicyTypeDto,
  UpdateVillaPolicyTypeSuccessResponse,
} from './dto';
import { VillaPolicyTypeService } from './villa-policy-type.service';

@UseGuards(JwtAuthGuard)
@Controller('villa-policy-types')
export class VillaPolicyTypeController {
  constructor(
    private readonly villaPolicyTypeService: VillaPolicyTypeService,
  ) {}

  @Post()
  async create(@Body() payload: CreateVillaPolicyTypeDto) {
    const result = await this.villaPolicyTypeService.create(payload);

    return new CreateVillaPolicyTypeSuccessResponse(result);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.villaPolicyTypeService.findAll(query);

    return new GetVillaPolicyTypesSuccessResponse(result);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.villaPolicyTypeService.findOne(id);

    return new GetVillaPolicyTypeSuccessResponse(result);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateVillaPolicyTypeDto,
  ) {
    const result = await this.villaPolicyTypeService.update(id, payload);

    return new UpdateVillaPolicyTypeSuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.villaPolicyTypeService.remove(id);

    return new DeleteResponse('delete villa policy type success');
  }
}
