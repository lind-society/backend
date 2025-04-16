import { AuthorizedRequest } from '@apps/main/common/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { JwtAuthGuard } from '../auth/guards';
import { DeleteResponse } from '../shared/dto/custom-responses';
import { AdminService } from './admin.service';
import {
  GetAdminsSuccessResponse,
  GetAdminSuccessResponse,
  UpdateAdminDto,
  UpdateAdminPasswordSuccessResponse,
  UpdateAdminSuccessResponse,
  ViewProfileSuccessResponse,
} from './dto';

@UseGuards(JwtAuthGuard)
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const result = await this.adminService.findAll(query);

    return new GetAdminsSuccessResponse(result);
  }

  @Get('profile')
  async viewProfile(@Request() req: AuthorizedRequest) {
    const result = await this.adminService.findOne(req.user.id);

    return new ViewProfileSuccessResponse(result);
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const result = await this.adminService.findOneByUsername(username);

    return new GetAdminSuccessResponse(result);
  }

  @Patch('profile')
  async updateProfile(
    @Request() req: AuthorizedRequest,
    @Body() payload: UpdateAdminDto,
  ) {
    const result = await this.adminService.updateProfile(req.user.id, payload);

    return new UpdateAdminSuccessResponse(result);
  }

  @Patch(':username')
  async update(
    @Param('username') username: string,
    @Body() payload: UpdateAdminDto,
  ) {
    const result = await this.adminService.updateByUsername(username, payload);

    return new UpdateAdminSuccessResponse(result);
  }

  @Patch(':username/password')
  async updatePassword(
    @Request() req: AuthorizedRequest,
    @Body() newPassword: string,
  ) {
    const result = await this.adminService.updatePassword(
      req.user.id,
      newPassword,
    );

    return new UpdateAdminPasswordSuccessResponse(result);
  }

  @Delete(':username')
  async delete(@Param('username') username: string) {
    await this.adminService.delete(username);

    return new DeleteResponse('delete admin success');
  }
}
