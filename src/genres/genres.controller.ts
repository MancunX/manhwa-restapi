import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GenresService } from './genres.service';
import {
  CreateGenreRequest,
  GenreResponse,
  UpdateGenreRequest,
} from 'src/model/genre.model';
import { Roles } from 'src/auth/decorator/role.decorator';
import { ApiTags } from '@nestjs/swagger';
import { WebResponse } from 'src/model/web.model';

@Roles('super', 'admin')
@Controller('api/genres')
@ApiTags('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  async create(@Body() request: CreateGenreRequest) {
    const genre = await this.genresService.create(request);
    return {
      statusCode: 201,
      success: true,
      data: genre,
    };
  }

  @Get()
  async findAll(): Promise<WebResponse<GenreResponse[]>> {
    const genre = await this.genresService.findAll();
    return {
      statusCode: 200,
      success: true,
      data: genre,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.genresService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() update: UpdateGenreRequest) {
    const genre = await this.genresService.update({ id, ...update });
    return {
      statusCode: 201,
      success: true,
      data: genre,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.genresService.remove(id);
  }
}
