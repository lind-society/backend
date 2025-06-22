import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HAL_EMBED_KEYS, HAL_ENTITY_TYPE } from '../constants';
import { getOriginalUrlEntity, HalHelper } from '../helpers';
import { IHalEmbededConfig } from '../interfaces';

@Injectable()
export class HalInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpCtx = context.switchToHttp();
    const request = httpCtx.getRequest<Request>();

    const entityType =
      this.reflector.get<string>(HAL_ENTITY_TYPE, context.getHandler()) ??
      this.reflector.get<string>(HAL_ENTITY_TYPE, context.getClass());

    const embedKeys =
      this.reflector.get<IHalEmbededConfig[]>(
        HAL_EMBED_KEYS,
        context.getHandler(),
      ) ??
      this.reflector.get<IHalEmbededConfig[]>(
        HAL_EMBED_KEYS,
        context.getClass(),
      );

    return next.handle().pipe(
      map((data) => {
        const fixedEntity =
          entityType ?? getOriginalUrlEntity(request.originalUrl);

        const response: any = {
          ...data,
        };

        const entity = data?.data;

        // 🟢 Handle Paginated Collection: data.data[]
        if (Array.isArray(entity?.data)) {
          response.data.data = entity.data.map((item) =>
            HalHelper.generateHalLinksWithEmbedded(
              item,
              request,
              fixedEntity,
              embedKeys,
            ),
          );
        }

        // 🟢 Handle Flat Array
        else if (Array.isArray(entity)) {
          response.data = entity.map((item) =>
            HalHelper.generateHalLinksWithEmbedded(
              item,
              request,
              fixedEntity,
              embedKeys,
            ),
          );
        }

        // 🟢 Handle Single Entity
        else if (entity && typeof entity === 'object') {
          response.data = HalHelper.generateHalLinksWithEmbedded(
            entity,
            request,
            fixedEntity,
            embedKeys,
          );
        }

        return response;
      }),
    );
  }
}
