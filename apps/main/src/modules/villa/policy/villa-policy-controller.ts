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
  CreateVillaPolicyDto,
  CreateVillaPolicySuccessResponse,
  GetVillaPoliciesSuccessResponse,
  GetVillaPolicySuccessResponse,
  UpdateVillaPolicyDto,
  UpdateVillaPolicySuccessResponse,
} from './dto';
import { VillaPolicyService } from './villa-policy.service';

@UseGuards(JwtAuthGuard)
@Controller('villa-policies')
export class VillaPolicyController {
  constructor(private readonly villaPolicyService: VillaPolicyService) {}

  @Post()
  async create(@Body() payload: CreateVillaPolicyDto) {
    const result = await this.villaPolicyService.create(payload);

    return new CreateVillaPolicySuccessResponse(result);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.villaPolicyService.findAll(query);

    return new GetVillaPoliciesSuccessResponse(result);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.villaPolicyService.findOne(id);

    return new GetVillaPolicySuccessResponse(result);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateVillaPolicyDto,
  ) {
    const result = await this.villaPolicyService.update(id, payload);

    return new UpdateVillaPolicySuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.villaPolicyService.remove(id);

    return new DeleteResponse('delete villa policy success');
  }
}
