import { SetMetadata } from '@nestjs/common';
import { HAL_EMBED_KEYS, HAL_ENTITY_TYPE, SKIP_HAL } from '../constants';
import { IHalEmbededConfig } from '../interfaces';

export function HalEntityType(type: string) {
  return SetMetadata(HAL_ENTITY_TYPE, type);
}

export function HalEmbedded(...embeddedKeys: IHalEmbededConfig[]) {
  return SetMetadata(HAL_EMBED_KEYS, embeddedKeys);
}

export function SkipHal() {
  return SetMetadata(SKIP_HAL, true);
}
