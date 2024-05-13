import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { ValidationModule } from 'src/validation/validation.module';
import { UsersModule } from 'src/users/users.module';
import { JwtAccessStrategy } from './strategy/jwt-access.strategy';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { RolesGuard } from './guard/role.guard';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    ValidationModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
