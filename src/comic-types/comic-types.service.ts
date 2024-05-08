import { HttpException, Injectable } from '@nestjs/common';
import {
  ComicTypeCreateRequest,
  ComicTypeResponse,
  ComicTypeUpdateRequest,
} from 'src/model/comicType.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationService } from 'src/validation/validation.service';
import { ComicTypeValidation } from './comic-types.validation';
import { generateSlug } from 'src/utils/slug';

@Injectable()
export class ComicTypesService {
  constructor(
    private prisma: PrismaService,
    private validationService: ValidationService,
  ) {}
  async create(request: ComicTypeCreateRequest): Promise<ComicTypeResponse> {
    const CreateRequest = await this.validationService.validate(
      ComicTypeValidation.CREATE,
      request,
    );
    const existingComicType = await this.prisma.comicTypes.findUnique({
      where: {
        slug: generateSlug(CreateRequest.name),
      },
    });
    if (existingComicType) {
      throw new HttpException('Comic type already exist', 400);
    }
    const newComicType = await this.prisma.comicTypes.create({
      data: {
        slug: generateSlug(CreateRequest.name),
        name: CreateRequest.name,
      },
    });
    return newComicType;
  }

  async findAll(): Promise<ComicTypeResponse[]> {
    const comicType = await this.prisma.comicTypes.findMany();
    return comicType;
  }

  async findOne(id: string): Promise<ComicTypeResponse> {
    const existingComicType = await this.prisma.comicTypes.findUnique({
      where: {
        id: id,
      },
      include: {
        comic: true,
      },
    });
    if (!existingComicType) {
      throw new HttpException(`Comic type ${id} no found`, 404);
    }
    return existingComicType;
  }

  async update(data: ComicTypeUpdateRequest): Promise<ComicTypeResponse> {
    const updateRequest = await this.validationService.validate(
      ComicTypeValidation.UPDATE,
      data,
    );
    const existingComicType = await this.prisma.comicTypes.findUnique({
      where: {
        id: data.id,
      },
    });
    if (!existingComicType) {
      throw new HttpException(`Comic type ${data.id} not found`, 404);
    }
    const update = await this.prisma.comicTypes.update({
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
    const existingComicType = await this.prisma.comicTypes.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingComicType) {
      throw new HttpException(`Comic type ${id} not found`, 404);
    }
    await this.prisma.comicTypes.delete({
      where: {
        id: id,
      },
    });
    return {
      message: 'Comic type deleted successfully',
    };
  }
}
