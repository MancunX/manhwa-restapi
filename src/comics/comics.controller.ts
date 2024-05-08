import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  Req,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ComicsService } from './comics.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  ComicResponse,
  ComicUpdateRequest,
  CreateComicRequest,
} from 'src/model/comic.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorator/role.decorator';
import { WebResponse } from 'src/model/web.model';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('api/comics')
@ApiTags('Comics')
export class ComicsController {
  constructor(private readonly comicsService: ComicsService) {}

  @Roles('super', 'admin')
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Comic',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
        },
        synopsis: {
          type: 'string',
        },
        author: {
          type: 'string',
        },
        artist: {
          type: 'string',
        },
        release: {
          type: 'string',
        },
        status: {
          type: 'string',
          enum: ['ongoing', 'complete'],
        },
        genreId: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        comicTypeId: {
          type: 'string',
        },
      },
    },
  })
  async create(
    @Body() request: CreateComicRequest,
    @UploadedFile() image: Express.Multer.File,
    @Req() req,
  ): Promise<WebResponse<ComicResponse>> {
    if (!image) {
      throw new BadRequestException('No image uploaded');
    }
    const comic = await this.comicsService.create(request, image, req);
    return {
      statusCode: 201,
      success: true,
      data: comic,
    };
  }

  @Public()
  @Get()
  async findAll(): Promise<WebResponse<ComicResponse>> {
    const comic = await this.comicsService.findAll();
    return {
      statusCode: 200,
      success: true,
      data: comic,
    };
  }

  @Public()
  @Get(':slug')
  async findOne(
    @Param('slug') slug: string,
  ): Promise<WebResponse<ComicResponse>> {
    const comic = await this.comicsService.findOne(slug);
    return {
      statusCode: 200,
      success: true,
      data: comic,
    };
  }

  @Roles('super', 'admin')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Comic',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
        },
        synopsis: {
          type: 'string',
        },
        author: {
          type: 'string',
        },
        artist: {
          type: 'string',
        },
        release: {
          type: 'string',
        },
        status: {
          type: 'string',
          enum: ['ongoing', 'complete'],
        },
        genreId: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        comicTypeId: {
          type: 'string',
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateComic: ComicUpdateRequest,
    @Req() req,
  ): Promise<WebResponse<ComicResponse>> {
    if (!image) {
      throw new BadRequestException('No image uploaded');
    }
    try {
      const comic = await this.comicsService.update(
        { id, ...updateComic },
        image,
        req,
      );
      return {
        statusCode: 200,
        success: true,
        data: comic,
      };
    } catch (error) {
      // Handle any errors
      return {
        statusCode: 500,
        success: false,
        message: 'Error during update',
      };
    }
  }

  @Roles('super', 'admin')
  @Delete(':slug')
  async remove(
    @Param('slug') slug: string,
  ): Promise<WebResponse<ComicResponse>> {
    const comic = await this.comicsService.remove(slug);
    return {
      statusCode: 200,
      success: true,
      message: `Comic ${slug} has been deleted successfully.`,
      data: comic,
    };
  }
}
