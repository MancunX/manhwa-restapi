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
    console.info('Creating Prisma service...');
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.info('Prisma connected');
    } catch (error) {
      console.error('Error connecting to Prisma:', error);
      throw error; // Rethrow the error to propagate it
    }
  }

  async onApplicationShutdown() {
    try {
      await this.$disconnect();
      console.info('Prisma disconnected');
    } catch (error) {
      console.error('Error disconnecting from Prisma:', error);
      throw error; // Rethrow the error to propagate it
    }
  }
}
