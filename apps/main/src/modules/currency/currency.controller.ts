import { Public } from '@apps/main/common/decorators';
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
import { JwtAuthGuard } from '../auth/guards';
import { DeleteResponse } from '../shared/dto/custom-responses';
import { CurrencyService } from './currency.service';
import {
  CreateCurrencyDto,
  CreateCurrencySuccessResponse,
  GetCurrenciesSuccessResponse,
  GetCurrencySuccessResponse,
  UpdateCurrencyDto,
  UpdateCurrencySuccessResponse,
} from './dto';

@UseGuards(JwtAuthGuard)
@Controller('currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post()
  async create(@Body() payload: CreateCurrencyDto) {
    const result = await this.currencyService.create(payload);

    return new CreateCurrencySuccessResponse(result);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.currencyService.findAll(query);

    return new GetCurrenciesSuccessResponse(result);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.currencyService.findOne(id);

    return new GetCurrencySuccessResponse(result);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateCurrencyDto,
  ) {
    const result = await this.currencyService.update(id, payload);

    return new UpdateCurrencySuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.currencyService.remove(id);

    return new DeleteResponse('delete currency success');
  }
}
