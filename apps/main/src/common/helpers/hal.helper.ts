import { Request } from 'express';
import { IHalEmbededConfig, IHalResource, ILinkHal } from '../interfaces';
import { entityNameMapper } from './entity-name-mapper.helper';

export class HalHelper {
  static generateResource<T>(
    data: T,
    links: Record<string, string | ILinkHal>,
  ): IHalResource<T> {
    const formattedLinks: Record<string, ILinkHal> = {};

    for (const [rel, link] of Object.entries(links)) {
      if (typeof link === 'string') {
        formattedLinks[rel] = { href: link };
      } else {
        formattedLinks[rel] = link;
      }
    }

    return {
      ...data,
      _links: formattedLinks,
    };
  }

  static generateEmbedded<T>(
    data: IHalResource,
    embeddedKey: string,
    embeddedResources: IHalResource | IHalResource[],
  ): IHalResource {
    return {
      ...data,
      _embedded: {
        ...(data._embedded || {}),
        [embeddedKey]: embeddedResources,
      },
    };
  }
  static generateHalLinksWithEmbedded<T>(
    item: T & { id: string; type?: string },
    request: Request,
    entityType: string,
    embedKeys: IHalEmbededConfig[] = [],
  ): any {
    const entity =
      entityType === 'search' ? entityNameMapper(item.type) : entityType;
    const selfLink = `${request.protocol}://${request.get('host')}/api/v1/${entity}${item.id ? `/${item.id}` : ''}`;
    const result: any = {
      ...item,
      link: selfLink,
    };

    for (const { name, path } of embedKeys) {
      const embeddedEntity = (item as any)[name];

      if (!embeddedEntity) continue;

      if (Array.isArray(embeddedEntity)) {
        result[name] = embeddedEntity
          .map((e: any) =>
            e?.id
              ? this.generateHalLinksWithEmbedded(e, request, path, embedKeys)
              : null,
          )
          .filter(Boolean);
      } else if (embeddedEntity.id) {
        result[name] = this.generateHalLinksWithEmbedded(
          embeddedEntity,
          request,
          path,
          embedKeys,
        );
      }
    }

    return result;
  }
}
