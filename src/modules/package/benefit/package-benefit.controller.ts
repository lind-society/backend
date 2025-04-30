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
import { JwtAuthGuard } from 'src/modules/auth/guards';
import { DeleteResponse } from 'src/modules/shared/dto/custom-responses';
import {
  CreatePackageBenefitDto,
  CreatePackageBenefitSuccessResponse,
  GetPackageBenefitsSuccessResponse,
  GetPackageBenefitSuccessResponse,
  UpdatePackageBenefitDto,
  UpdatePackageBenefitSuccessResponse,
} from './dto';
import { PackageBenefitService } from './package-benefit.service';

@UseGuards(JwtAuthGuard)
@Controller('package-benefits')
export class PackageBenefitController {
  constructor(private readonly packagebenefitService: PackageBenefitService) {}

  @Post()
  async create(@Body() payload: CreatePackageBenefitDto) {
    const result = await this.packagebenefitService.create(payload);

    return new CreatePackageBenefitSuccessResponse(result);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.packagebenefitService.findAll(query);

    return new GetPackageBenefitsSuccessResponse(result);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.packagebenefitService.findOne(id);

    return new GetPackageBenefitSuccessResponse(result);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdatePackageBenefitDto,
  ) {
    const result = await this.packagebenefitService.update(id, payload);

    return new UpdatePackageBenefitSuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.packagebenefitService.remove(id);

    return new DeleteResponse('delete package benefit success');
  }
}
