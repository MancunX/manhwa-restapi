import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { ValidationModule } from 'src/validation/validation.module';

@Module({
  imports: [ValidationModule],
  controllers: [ChaptersController],
  providers: [ChaptersService],
})
export class ChaptersModule {}
