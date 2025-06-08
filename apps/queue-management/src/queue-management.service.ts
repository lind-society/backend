import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueManagementService {
  getHello(): string {
    return 'Hello World!';
  }
}
