import { Public } from '@apps/main/common/decorators';
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
  CreateVillaPriceRuleDto,
  CreateVillaPriceRuleSuccessResponse,
  GetAvailableVillaSuccessResponse,
  GetVillaPriceRulesSuccessResponse,
  GetVillaPriceRuleSuccessResponse,
  GetVillaWithPriceRuleDto,
  UpdateVillaPriceRuleDto,
  UpdateVillaPriceRuleSuccessResponse,
} from './dto';
import { VillaPriceRuleService } from './villa-price-rule.service';

@UseGuards(JwtAuthGuard)
@Controller('villa-price-rules')
export class VillaPriceRuleController {
  constructor(private readonly villaPriceRuleService: VillaPriceRuleService) {}

  @Post()
  async create(@Body() payload: CreateVillaPriceRuleDto) {
    const result = await this.villaPriceRuleService.create(payload);

    return new CreateVillaPriceRuleSuccessResponse(result);
  }

  @Public()
  @Get('available-villas')
  async findAvailableVillasWithinDate(
    @Body() payload: GetVillaWithPriceRuleDto,
  ) {
    const result =
      await this.villaPriceRuleService.findAvailableVillasWithinDate(payload);

    return new GetAvailableVillaSuccessResponse(result);
  }

  @Public()
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.villaPriceRuleService.findAll(query);

    return new GetVillaPriceRulesSuccessResponse(result);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.villaPriceRuleService.findOne(id);

    return new GetVillaPriceRuleSuccessResponse(result);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateVillaPriceRuleDto,
  ) {
    const result = await this.villaPriceRuleService.update(id, payload);

    return new UpdateVillaPriceRuleSuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.villaPriceRuleService.remove(id);

    return new DeleteResponse('delete villa price rule success');
  }
}
