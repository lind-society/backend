import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.isPublicRoute(context)) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<AdminPayloadDto>(
    err: any,
    user: AdminPayloadDto,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): AdminPayloadDto {
    if (info instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedException('token expired');
    }

    if (err || !user) {
      throw new UnauthorizedException('unauthorized admin');
    }

    return user;
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return (
      this.reflector.getAllAndOverride<boolean>('public', [
        context.getHandler(),
        context.getClass(),
      ]) ?? false
    );
  }
}
