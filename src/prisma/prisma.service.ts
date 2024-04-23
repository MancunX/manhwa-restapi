import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnApplicationShutdown
{
  constructor() {
    super();
    console.info('Create prisma service');
  }

  onModuleInit() {
    console.info('Prisma connected');
    this.$connect();
  }

  onApplicationShutdown() {
    console.info('Prisma disconnect');
    this.$disconnect();
  }
}
