import { IJwtPayload, IJwtTokens } from '@apps/main/common/interfaces';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminService } from '../admin/admin.service';
import { AdminPayloadDto, CreateAdminDto } from '../admin/dto';
import { LoginRequestDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private adminService: AdminService,
  ) {}

  async validateAdmin(payload: LoginRequestDto): Promise<AdminPayloadDto> {
    const adminCredentials = await this.adminService.findCredentialByIdentifier(
      payload.identifier,
    );

    const isPasswordMatch = await bcrypt.compare(
      payload.password,
      adminCredentials.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('invalid credentials');
    }

    const adminPayload: AdminPayloadDto = {
      id: adminCredentials.id,
      username: adminCredentials.username,
      email: adminCredentials.email,
      phoneNumber: adminCredentials.phoneNumber,
    };

    return adminPayload;
  }

  async register(payload: CreateAdminDto): Promise<AdminPayloadDto> {
    const admin = await this.adminService.create(payload);

    return admin;
  }

  async login(payload: AdminPayloadDto): Promise<IJwtTokens> {
    const accessToken = await this._signAccessToken(payload);
    const refreshToken = await this._signRefreshToken(payload);

    await this.adminService.setCurrentRefreshToken(refreshToken, payload.id);

    const tokens: IJwtTokens = {
      accessToken,
      refreshToken,
    };

    return tokens;
  }

  async logout(payload: AdminPayloadDto): Promise<void> {
    await this.adminService.findPayloadById(payload.id);

    return await this.adminService.removeRefreshToken(payload.id);
  }

  async refreshTokens(payload: AdminPayloadDto): Promise<IJwtTokens> {
    const accessToken = await this._signAccessToken(payload);
    const refreshToken = await this._signRefreshToken(payload);

    await this.adminService.setCurrentRefreshToken(refreshToken, payload.id);

    const tokens: IJwtTokens = {
      accessToken,
      refreshToken,
    };

    return tokens;
  }

  private async _signAccessToken(payload: AdminPayloadDto): Promise<string> {
    const jwtPayload = this._jwtPayloadMapper(payload);

    const accessToken = await this.jwtService.signAsync(jwtPayload);

    return accessToken;
  }

  private async _signRefreshToken(payload: AdminPayloadDto): Promise<string> {
    const jwtPayload = this._jwtPayloadMapper(payload);

    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>('jwt.refreshToken.secret'),
      expiresIn: this.configService.get<string>('jwt.refreshToken.expire'),
    });

    return refreshToken;
  }

  private _jwtPayloadMapper(payload: AdminPayloadDto): IJwtPayload {
    return {
      sub: payload.id,
      username: payload.username,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
    };
  }

  // To Do :
  // 1. request reset password (send otp or link via email/whatsapp)
  // 2. implement "updatePassword" method
  async updatePassword(
    payload: AdminPayloadDto,
    newPassword: string,
  ): Promise<AdminPayloadDto> {
    await this.adminService.findPayloadById(payload.id);

    return await this.adminService.updatePassword(payload.id, newPassword);
  }
}
