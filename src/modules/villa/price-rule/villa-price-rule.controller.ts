import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Public } from 'src/common/decorators';
import { DeleteResponse } from 'src/modules/shared/dto/custom-responses';
import {
  CreateVillaPriceRuleDto,
  CreateVillaPriceRuleSuccessResponse,
  GetVillaPriceRulesSuccessResponse,
  GetVillaPriceRuleSuccessResponse,
  UpdateVillaPriceRuleDto,
  UpdateVillaPriceRuleSuccessResponse,
} from './dto';
import { VillaPriceRuleService } from './villa-price-rule.service';

@Controller('villa-price-rules')
export class VillaPriceRuleController {
  constructor(private readonly villaPriceRuleService: VillaPriceRuleService) {}

  @Post()
  async create(@Body() payload: CreateVillaPriceRuleDto) {
    const result = await this.villaPriceRuleService.create(payload);

    return new CreateVillaPriceRuleSuccessResponse(result);
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
