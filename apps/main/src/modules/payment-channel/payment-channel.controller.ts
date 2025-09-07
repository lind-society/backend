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
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { DeleteResponse } from '../shared/dto/custom-responses';
import {
  CreatePaymentChannelDto,
  CreatePaymentChannelSuccessResponse,
  GetPaymentChannelsSuccessResponse,
  GetPaymentChannelSuccessResponse,
  UpdatePaymentChannelDto,
  UpdatePaymentChannelSuccessResponse,
} from './dto';
import { PaymentChannelService } from './payment-channel.service';

@Controller('payment-channels')
export class PaymentChannelController {
  constructor(private readonly paymentChannelService: PaymentChannelService) {}
  @Post()
  async create(@Body() payload: CreatePaymentChannelDto) {
    const result = await this.paymentChannelService.create(payload);

    return new CreatePaymentChannelSuccessResponse(result);
  }

  @Public()
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.paymentChannelService.findAll(query);

    return new GetPaymentChannelsSuccessResponse(result);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.paymentChannelService.findOne(id);

    return new GetPaymentChannelSuccessResponse(result);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdatePaymentChannelDto,
  ) {
    const result = await this.paymentChannelService.update(id, payload);

    return new UpdatePaymentChannelSuccessResponse(result);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.paymentChannelService.remove(id);

    return new DeleteResponse('delete payment channel success');
  }
}
