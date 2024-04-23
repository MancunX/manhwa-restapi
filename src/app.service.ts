import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAccessDenied(): string {
    return 'Access denied';
  }
}
