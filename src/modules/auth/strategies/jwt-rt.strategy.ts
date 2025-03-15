import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from 'src/common/interfaces';
import { AdminService } from 'src/modules/admin/admin.service';

@Injectable()
export class JwtRtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    configService: ConfigService,
    private adminService: AdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt.refreshToken.secret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IJwtPayload) {
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    return this.adminService.findOneIfRefreshTokenMatch(
      payload.sub,
      refreshToken,
    );
  }
}
