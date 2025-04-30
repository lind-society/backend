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
  UseInterceptors,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Public } from 'src/common/decorators';
import { PriceConverterInterceptor } from 'src/common/interceptors';
import { JwtAuthGuard } from '../auth/guards';
import { DeleteResponse } from '../shared/dto/custom-responses';
import {
  CreateFacilityDto,
  CreateFacilitySuccessResponse,
  GetFacilitiesSuccessResponse,
  GetFacilitySuccessResponse,
  UpdateFacilityDto,
  UpdateFacilitySuccessResponse,
} from './dto';
import { FacilityService } from './facility.service';

@UseGuards(JwtAuthGuard)
@Controller('facilities')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Post()
  async create(@Body() payload: CreateFacilityDto) {
    const facility = await this.facilityService.create(payload);

    return new CreateFacilitySuccessResponse(facility);
  }

  @Public()
  @UseInterceptors(PriceConverterInterceptor)
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const facilities = await this.facilityService.findAll(query);

    return new GetFacilitiesSuccessResponse(facilities);
  }

  @Public()
  @UseInterceptors(PriceConverterInterceptor)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const facility = await this.facilityService.findOne(id);

    return new GetFacilitySuccessResponse(facility);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFacilityDto: UpdateFacilityDto,
  ) {
    const facility = await this.facilityService.update(id, updateFacilityDto);

    return new UpdateFacilitySuccessResponse(facility);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.facilityService.remove(id);

    return new DeleteResponse('delete facility success');
  }
}
