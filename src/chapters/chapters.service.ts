import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ChapterCreateRequest,
  ChapterResponse,
  ChapterUpdateRequest,
} from 'src/model/chapter.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationService } from 'src/validation/validation.service';
import { ChapterValidation } from './chapters.validation';
import { generateSlug } from 'src/utils/slug';

@Injectable()
export class ChaptersService {
  constructor(
    private prisma: PrismaService,
    private validationService: ValidationService,
  ) {}

  async create(
    slug: string,
    request: ChapterCreateRequest,
  ): Promise<ChapterResponse> {
    const createRequest = await this.validationService.validate(
      ChapterValidation.CREATE,
      request,
    );
    const comic = await this.prisma.comics.findUnique({
      where: {
        slug: slug,
      },
    });
    if (!comic) {
      throw new NotFoundException(`Comic ${comic.name} not found`);
    }
    try {
      const newSlug = generateSlug(`${comic.slug}-' '-${createRequest.name}`);
      let chapter = await this.prisma.chapters.findUnique({
        where: {
          slug: newSlug,
        },
        include: {
          comic: true,
        },
      });
      if (chapter) {
        throw new ConflictException(
          `Chapter ${chapter.name} has been already exist.`,
        );
      }
      chapter = await this.prisma.chapters.create({
        data: {
          slug: newSlug,
          name: createRequest.name,
          content: createRequest.content,
          comicId: comic.id,
        },
        include: {
          comic: true,
        },
      });
      if (!chapter) {
        throw new BadRequestException();
      }
      return chapter;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async findAll(comicSlug: string): Promise<ChapterResponse[]> {
    try {
      const comic = await this.prisma.comics.findUnique({
        where: {
          slug: comicSlug,
        },
      });
      if (!comic) {
        throw new NotFoundException();
      }
      const chapter = await this.prisma.chapters.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          comic: {
            select: {
              id: true,
              image: true,
              name: true,
            },
          },
        },
      });
      return chapter;
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        const errorMessage = `Comic ${comicSlug} not found`;
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: errorMessage,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  async findOne(
    chapterSlug: string,
    comicSlug: string,
  ): Promise<ChapterResponse> {
    try {
      const comic = await this.prisma.comics.findUnique({
        where: {
          slug: comicSlug,
        },
      });
      if (!comic) {
        throw new NotFoundException();
      }
      const chapter = await this.prisma.chapters.findUnique({
        where: {
          slug: chapterSlug,
        },
        include: {
          comic: true,
        },
      });
      if (!chapter) {
        throw new NotFoundException(`Chapter ${chapter.name} not found`);
      }
      return chapter;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async update(comicSlug: string, data: ChapterUpdateRequest) {
    const updateRequest = await this.validationService.validate(
      ChapterValidation.UPDATE,
      data,
    );
    const comic = await this.prisma.comics.findUnique({
      where: {
        slug: comicSlug,
      },
    });
    if (!comic) {
      throw new NotFoundException(`Comic ${comicSlug} not found.`);
    }
    try {
      let chapter = await this.prisma.chapters.findUnique({
        where: {
          id: data.id,
        },
        include: {
          comic: true,
        },
      });
      if (!chapter) {
        throw new NotFoundException(`Chapter ${data.id} not found.`);
      }
      const updateSlug = generateSlug(
        `${comic.slug}-' '-${updateRequest.name}`,
      );
      chapter = await this.prisma.chapters.update({
        where: {
          id: data.id,
        },
        data: {
          slug: updateSlug,
          name: updateRequest.name,
          content: updateRequest.content,
          comicId: comic.id,
        },
        include: {
          comic: true,
        },
      });

      return chapter;
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(
    comicSlug: string,
    slugOrSlugs: string,
  ): Promise<ChapterResponse> {
    try {
      const comic = await this.prisma.comics.findUnique({
        where: {
          slug: comicSlug,
        },
      });
      if (!comic) {
        throw new NotFoundException();
      }
      let chapter = await this.prisma.chapters.findUnique({
        where: {
          slug: slugOrSlugs,
        },
        include: {
          comic: {
            select: {
              id: true,
              image: true,
              name: true,
            },
          },
        },
      });
      if (!chapter) {
        throw new NotFoundException();
      }
      chapter = await this.prisma.chapters.delete({
        where: {
          slug: slugOrSlugs,
        },
        include: {
          comic: {
            select: {
              id: true,
              image: true,
              name: true,
            },
          },
        },
      });
      return chapter;
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new InternalServerErrorException();
    }
  }
}
