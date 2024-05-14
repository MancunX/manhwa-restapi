import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { RolesGuard } from './auth/guard/role.guard';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { TimeoutMiddleware } from './middleware/timeout.middleware';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.ACCESS_SECRET_KEY,
    }),
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TimeoutMiddleware).forRoutes('*');
  }
}
