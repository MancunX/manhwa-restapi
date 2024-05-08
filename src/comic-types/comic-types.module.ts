import { Module } from '@nestjs/common';
import { ComicTypesService } from './comic-types.service';
import { ComicTypesController } from './comic-types.controller';
import { ValidationModule } from 'src/validation/validation.module';

@Module({
  imports: [ValidationModule],
  controllers: [ComicTypesController],
  providers: [ComicTypesService],
})
export class ComicTypesModule {}
