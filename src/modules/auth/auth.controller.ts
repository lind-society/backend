import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthorizedRequest } from 'src/common/types';
import { CreateAdminDto, CreateAdminSuccessResponse } from '../admin/dto';
import { LogoutResponse } from '../shared/dto/custom-responses/logout-response.dto';
import { AuthService } from './auth.service';
import { LoginSuccessResponse, RefreshTokenSuccessResponse } from './dto';
import { JwtAuthGuard, JwtRefreshGuard, LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: CreateAdminDto) {
    const result = await this.authService.register(payload);

    return new CreateAdminSuccessResponse(result);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: AuthorizedRequest) {
    const result = await this.authService.login(req.user);

    return new LoginSuccessResponse(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: AuthorizedRequest) {
    await this.authService.logout(req.user);

    return new LogoutResponse();
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh-tokens')
  async refreshTokens(@Request() req: AuthorizedRequest) {
    const result = await this.authService.refreshTokens(req.user);

    return new RefreshTokenSuccessResponse(result);
  }
}
