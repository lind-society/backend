import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigHelper {
  static service: ConfigService;

  constructor(service: ConfigService) {
    ConfigHelper.service = service;
  }

  static get(key: string): any {
    return ConfigHelper.service.get(key);
  }
}
