import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { ValidationModule } from 'src/validation/validation.module';

@Module({
  imports: [ValidationModule],
  controllers: [GenresController],
  providers: [GenresService],
})
export class GenresModule {}
