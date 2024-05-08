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
@Module({
  imports: [
    PrismaModule,
    ValidationModule,
    UsersModule,
    AuthModule,
    ComicsModule,
    GenresModule,
    ComicTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
