import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ValidationModule } from './validation/validation.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, ValidationModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
