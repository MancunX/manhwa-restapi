import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ValidationModule } from './validation/validation.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ComicsModule } from './comics/comics.module';
import { GenresModule } from './genres/genres.module';
import { ComicTypesModule } from './comic-types/comic-types.module';
import { ChaptersModule } from './chapters/chapters.module';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { RolesGuard } from './auth/guard/role.guard';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    ValidationModule,
    UsersModule,
    AuthModule,
    ComicsModule,
    GenresModule,
    ComicTypesModule,
    ChaptersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
