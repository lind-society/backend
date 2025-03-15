import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Public } from 'src/common/decorators';
import { DeleteResponse } from 'src/modules/shared/dto/custom-responses';
import { CurrencyConverterService } from './currency-converter.service';
import {
  ConvertPriceToBasePriceRequestDto,
  ConvertPriceToBasePriceSuccessResponse,
  CreateCurrencyConverterDto,
  CreateCurrencyConverterSuccessResponse,
  GetCurrencyConvertersSuccessResponse,
  GetCurrencyConverterSuccessResponse,
  UpdateCurrencyConverterDto,
  UpdateCurrencyConverterSuccessResponse,
} from './dto';

@Controller('currency-converters')
export class CurrencyConverterController {
  constructor(
    private readonly currencyConverterService: CurrencyConverterService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('base')
  async convertPriceToBasePrice(
    @Body() payload: ConvertPriceToBasePriceRequestDto,
  ) {
    const result =
      await this.currencyConverterService.convertPriceToBasePrice(payload);

    return new ConvertPriceToBasePriceSuccessResponse(result);
  }

  @Post()
  async create(@Body() payload: CreateCurrencyConverterDto) {
    const result = await this.currencyConverterService.create(payload);

    return new CreateCurrencyConverterSuccessResponse(result);
  }

  @Public()
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.currencyConverterService.findAll(query);

    return new GetCurrencyConvertersSuccessResponse(result);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.currencyConverterService.findOne(id);

    return new GetCurrencyConverterSuccessResponse(result);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateCurrencyConverterDto,
  ) {
    const result = await this.currencyConverterService.update(id, payload);

    return new UpdateCurrencyConverterSuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.currencyConverterService.remove(id);

    return new DeleteResponse('delete currency converter success');
  }
}
