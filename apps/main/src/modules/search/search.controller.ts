import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import {
  GetSearchEntitiesQueryDto,
  GetSearchEntitiesSuccessResponse,
} from './dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async findAll(
    @Req() req: Request,
    @Query() query: GetSearchEntitiesQueryDto,
  ) {
    const result = await this.searchService.findMany(req, query);

    return new GetSearchEntitiesSuccessResponse(result);
  }
}
