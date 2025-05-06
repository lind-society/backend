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
import {
  CreatePackageDto,
  CreatePackageSuccessResponse,
  GetPackagesSuccessResponse,
  GetPackageSuccessResponse,
  UpdatePackageDto,
  UpdatePackageSuccessResponse,
} from './dto';
import { PackageService } from './package.service';

@UseGuards(JwtAuthGuard)
@Controller('packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  async create(@Body() payload: CreatePackageDto) {
    const result = await this.packageService.create(payload);

    return new CreatePackageSuccessResponse(result);
  }

  @Public()
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.packageService.findAll(query);

    return new GetPackagesSuccessResponse(result);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.packageService.findOne(id);

    return new GetPackageSuccessResponse(result);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdatePackageDto,
  ) {
    const result = await this.packageService.update(id, payload);

    return new UpdatePackageSuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.packageService.remove(id);

    return new DeleteResponse('delete package success');
  }
}
