import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
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
          secret: configService.get<string>('jwt.atSecret'),
          signOptions: {
            expiresIn: configService.get<string>('jwt.atExpire'),
          },
        };
      },
    }),
    AdminModule,
  ],
})
export class AuthModule {}
