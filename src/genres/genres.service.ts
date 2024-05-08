import { HttpException, Injectable } from '@nestjs/common';
import {
  CreateGenreRequest,
  GenreResponse,
  UpdateGenreRequest,
} from 'src/model/genre.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationService } from 'src/validation/validation.service';
import { GenreValidation } from './genres.validation';
import { generateSlug } from 'src/utils/slug';

@Injectable()
export class GenresService {
  constructor(
    private prisma: PrismaService,
    private validationService: ValidationService,
  ) {}
  async create(request: CreateGenreRequest): Promise<GenreResponse> {
    const CreateRequest = await this.validationService.validate(
      GenreValidation.CREATE,
      request,
    );
    const existingGenre = await this.prisma.genres.findUnique({
      where: {
        slug: generateSlug(CreateRequest.name),
      },
    });
    if (existingGenre) {
      throw new HttpException('Genre already exists', 400);
    }
    const newGenre = await this.prisma.genres.create({
      data: {
        slug: generateSlug(CreateRequest.name),
        name: CreateRequest.name,
      },
    });
    return newGenre;
  }

  async findAll(): Promise<GenreResponse[]> {
    const genre = await this.prisma.genres.findMany();
    return genre;
  }

  async findOne(id: string): Promise<GenreResponse> {
    const genre = this.prisma.genres.findUnique({
      where: {
        id: id,
      },
      include: {
        comic: true,
      },
    });
    return genre;
  }

  async update(data: UpdateGenreRequest): Promise<GenreResponse> {
    const updateRequest = this.validationService.validate(
      GenreValidation.UPDATE,
      data,
    );
    const existingGenre = await this.prisma.genres.findUnique({
      where: {
        id: data.id,
      },
    });
    if (!existingGenre) {
      throw new HttpException(`Genre ${data.id} not found`, 404);
    }

    const update = await this.prisma.genres.update({
      where: {
        id: data.id,
      },
      data: {
        slug: generateSlug(updateRequest.name),
        name: updateRequest.name,
      },
    });
    return update;
  }

  async remove(id: string): Promise<any> {
    const existingGenre = await this.prisma.genres.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingGenre) {
      throw new HttpException(`Genre ${id} not found`, 404);
    }
    await this.prisma.genres.delete({
      where: {
        id: id,
      },
    });
    return {
      message: 'Genre deleted successfully',
    };
  }
}
