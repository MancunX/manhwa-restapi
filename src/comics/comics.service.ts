import {
  HttpException,
  Injectable,
  NotFoundException,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { ComicUpdateRequest, CreateComicRequest } from 'src/model/comic.model';
import { ValidationService } from 'src/validation/validation.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ComicValidation } from './comic.validation';
import { generateSlug } from 'src/utils/slug';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { extractPublicIdFromUrl } from 'src/utils/cloudinary';

@Injectable()
export class ComicsService {
  constructor(
    private validationService: ValidationService,
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: this.configService.get('cloudinary.cloudName'),
      api_key: this.configService.get('cloudinary.apiKey'),
      api_secret: this.configService.get('cloudinary.apiSecret'),
    });
  }
  async create(
    request: CreateComicRequest,
    @UploadedFile() image: Express.Multer.File,
    @Req() req,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const createRequest: CreateComicRequest = this.validationService.validate(
        ComicValidation.CREATE,
        request,
      );
      const user = req.user;

      cloudinary.uploader
        .upload_stream({ resource_type: 'image' }, async (error, result) => {
          if (error) {
            reject(new HttpException('Error upload image', 400));
          } else {
            try {
              const newComic = await this.prisma.comics.create({
                data: {
                  slug: generateSlug(createRequest.name),
                  name: createRequest.name,
                  image: result.secure_url,
                  synopsis: createRequest.synopsis,
                  author: createRequest.author,
                  artist: createRequest.artist,
                  release: createRequest.release,
                  status: createRequest.status,
                  genre: {
                    create: createRequest.genreId.map((id: string) => ({
                      genre: {
                        connect: { id },
                      },
                    })),
                  },
                  comicType: {
                    connect: {
                      id: createRequest.comicTypeId,
                    },
                  },
                  user: {
                    connect: {
                      id: user.id,
                    },
                  },
                },
                include: {
                  comicType: {
                    select: {
                      id: true,
                    },
                  },
                  genre: {
                    select: {
                      genreId: true,
                    },
                  },
                  user: {
                    select: {
                      id: true,
                    },
                  },
                },
              });
              resolve(newComic);
            } catch (err) {
              reject(new HttpException('Error creating comic', 500));
            }
          }
        })
        .end(req.file?.buffer);
    });
  }

  async findAll(): Promise<any> {
    const comic = await this.prisma.comics.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return comic;
  }

  async findOne(slug: string): Promise<any> {
    const existingComic = await this.prisma.comics.findUnique({
      where: {
        slug: slug,
      },
      include: {
        genre: {
          select: {
            genre: true,
          },
        },
        comicType: true,
        chapter: true,
        user: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!existingComic) {
      throw new NotFoundException(`Comid ${slug} not found`);
    }
    return existingComic;
  }

  async update(
    data: ComicUpdateRequest,
    image: Express.Multer.File,
    @Req() req,
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const updateRequest = await this.validationService.validate(
        ComicValidation.UPDATE,
        data,
      );
      const existingComic = await this.prisma.comics.findUnique({
        where: {
          id: data.id,
        },
        include: {
          genre: {
            select: {
              genre: true,
            },
          },
          comicType: true,
          chapter: true,
        },
      });

      if (!existingComic) {
        throw new NotFoundException(`Comic with ID ${data.id} not found`);
      }
      if (req.file) {
        try {
          const oldImagePublicId = extractPublicIdFromUrl(existingComic.image);
          const uploadResult = cloudinary.uploader
            .upload_stream({ resource_type: 'auto' }, async (error, result) => {
              if (error) {
                reject(new HttpException('Error upload image', 400));
              }
              const update = await this.prisma.comics.update({
                where: {
                  id: data.id,
                },
                data: {
                  slug: generateSlug(updateRequest.name),
                  name: updateRequest.name,
                  image: result.secure_url,
                  synopsis: updateRequest.synopsis,
                  author: updateRequest.author,
                  artist: updateRequest.artist,
                  release: updateRequest.release,
                  status: updateRequest.status,
                  genre: {
                    upsert: updateRequest.genreId.map((id: string) => ({
                      where: {
                        genreId_comicId: {
                          genreId: id,
                          comicId: data.id, // Gunakan ID komik dari data yang diterima
                        },
                      },
                      create: {
                        genre: {
                          connect: { id: id },
                        },
                      },
                      update: {}, // Tetap kosong karena tidak ada pembaruan yang dilakukan
                    })),
                  },
                  comicType: {
                    connect: {
                      id: updateRequest.comicTypeId,
                    },
                  },
                },
                include: {
                  comicType: {
                    select: {
                      id: true,
                    },
                  },
                  genre: {
                    select: {
                      genre: true,
                    },
                  },
                  user: {
                    select: {
                      id: true,
                    },
                  },
                },
              });
              resolve(update);
            })
            .end(req.file?.buffer);
          if (!uploadResult) return;

          if (oldImagePublicId) {
            try {
              await cloudinary.uploader.destroy(oldImagePublicId);
            } catch (deleteError) {
              console.error(
                'Error deleting old image from Cloud:',
                deleteError,
              );
            }
          }
          return uploadResult;
        } catch (uploadError) {
          console.error('Error during file upload:', uploadError);
        }
      }
    });
  }

  async remove(slug: string): Promise<any> {
    let comicToDelete = await this.prisma.comics.findUnique({
      where: {
        slug: slug,
      },
      include: {
        genre: {
          select: {
            genre: true,
          },
        },
        comicType: true,
        chapter: true,
      },
    });
    if (!comicToDelete) {
      throw new NotFoundException(`Comic ${slug} not found`);
    }
    const cloudinaryPublicId = extractPublicIdFromUrl(comicToDelete.image);
    if (cloudinaryPublicId) {
      await cloudinary.uploader.destroy(cloudinaryPublicId);
    }
    comicToDelete = await this.prisma.comics.delete({
      where: {
        slug: comicToDelete.slug,
      },
      include: {
        genre: {
          select: {
            genre: true,
          },
        },
        comicType: true,
        chapter: true,
      },
    });
    return comicToDelete;
  }
}
