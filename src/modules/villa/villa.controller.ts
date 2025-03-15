import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Public } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards';
import { DeleteResponse } from '../shared/dto/custom-responses';
import {
  CreateVillaDto,
  CreateVillaSuccessResponse,
  GetVillaParamsDto,
  GetVillasSuccessResponse,
  GetVillaSuccessResponse,
  UpdateVillaDto,
  UpdateVillaSuccessResponse,
} from './dto';
import { VillaService } from './villa.service';

@UseGuards(JwtAuthGuard)
@Controller('villas')
export class VillaController {
  constructor(private readonly villaService: VillaService) {}

  @Post()
  async create(@Body() payload: CreateVillaDto) {
    const result = await this.villaService.create(payload);

    return new CreateVillaSuccessResponse(result);
  }

  @Public()
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.villaService.findAll(query);

    return new GetVillasSuccessResponse(result);
  }

  @Public()
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
