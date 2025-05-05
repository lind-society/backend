import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Public } from 'src/common/decorators';
import { PriceConverterInterceptor } from 'src/common/interceptors';
import { JwtAuthGuard } from '../auth/guards';
import { DeleteResponse } from '../shared/dto/custom-responses';
import {
  CreateVillaDto,
  CreateVillaSuccessResponse,
  GetVillaBestSellerQueryDto,
  GetVillaBestSellerSuccessResponse,
  GetVillasSuccessResponse,
  GetVillaSuccessResponse,
  UpdateVillaDto,
  UpdateVillaSuccessResponse,
} from './dto';
import { VillaService } from './villa.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(PriceConverterInterceptor)
@Controller('villas')
export class VillaController {
  constructor(private readonly villaService: VillaService) {}

  @Post()
  async create(@Body() payload: CreateVillaDto) {
    const result = await this.villaService.create(payload);

    return new CreateVillaSuccessResponse(result);
  }

  @Public()
  @Get('/best-seller')
  async findBestSeller(@Query() query: GetVillaBestSellerQueryDto) {
    const result = await this.villaService.findBestSeller(query.option);

    return new GetVillaBestSellerSuccessResponse(result, query.option);
  }

  @Public()
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.villaService.findAll(query);

    return new GetVillasSuccessResponse(result);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.villaService.findOne(id);

    return new GetVillaSuccessResponse(result);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateVillaDto,
  ) {
    const result = await this.villaService.update(id, payload);

    return new UpdateVillaSuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.villaService.remove(id);

    return new DeleteResponse('delete villa success');
  }
}
