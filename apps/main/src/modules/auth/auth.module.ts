import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { AdminModule } from '../admin/admin.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAtStrategy, JwtRtStrategy, LocalStrategy } from './strategies';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAtStrategy, JwtRtStrategy, LocalStrategy],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwt.accessToken.secret'),
          signOptions: {
            expiresIn: configService.get<string>(
              'jwt.accessToken.expire',
            ) as JwtSignOptions['expiresIn'],
          },
        };
      },
    }),
    AdminModule,
  ],
})
export class AuthModule {}
