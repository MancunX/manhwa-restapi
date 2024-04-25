import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ValidationModule } from './validation/validation.module';

@Module({
  imports: [PrismaModule, ValidationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
