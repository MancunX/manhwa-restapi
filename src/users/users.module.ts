import { ValidationModule } from './../validation/validation.module';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [ValidationModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
