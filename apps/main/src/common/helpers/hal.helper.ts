import { Request } from 'express';
import { IHalEmbededConfig, IHalResource, ILinkHal } from '../interfaces';

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
    item: T & { id: string },
    request: Request,
    entityType: string,
    embedKeys: IHalEmbededConfig[] = [],
  ): IHalResource<T> {
    const selfHref = `${request.protocol}://${request.get('host')}/api/v1/${entityType}/${item.id}`;
    const embeddedLinks: Record<string, ILinkHal> = {};

    if (embedKeys?.length) {
      for (const { name, path } of embedKeys) {
        const embeddedEntity = item[name];
        if (embeddedEntity?.id) {
          embeddedLinks[name] = {
            href: `${request.protocol}://${request.get('host')}/api/v1/${path}/${embeddedEntity.id}`,
          };
        }
      }
    }

    return {
      ...item,
      _links: {
        self: { href: selfHref },
        ...embeddedLinks,
      },
    };
  }
}
