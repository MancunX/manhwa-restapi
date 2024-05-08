import { Module } from '@nestjs/common';
import { ComicsService } from './comics.service';
import { ComicsController } from './comics.controller';
import { ValidationModule } from 'src/validation/validation.module';
import { ConfigModule } from '@nestjs/config';
import cloudinaryConfig from 'src/config/cloudinary.config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ValidationModule,
    MulterModule,
    ConfigModule.forRoot({
      load: [cloudinaryConfig],
    }),
  ],
  controllers: [ComicsController],
  providers: [ComicsService],
})
export class ComicsModule {}
