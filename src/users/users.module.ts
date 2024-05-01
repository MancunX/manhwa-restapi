import { ValidationModule } from './../validation/validation.module';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';

@Module({
  imports: [ValidationModule],
  providers: [
    UsersService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
