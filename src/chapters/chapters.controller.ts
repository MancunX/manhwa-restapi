import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { WebResponse } from 'src/model/web.model';
import {
  ChapterCreateRequest,
  ChapterResponse,
  ChapterUpdateRequest,
} from 'src/model/chapter.model';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';
import { Roles } from 'src/auth/decorator/role.decorator';

@Controller('api/comics/:comicSlug/chapters')
@ApiTags('Comic Chapter')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Roles('super', 'admin')
  @HttpCode(201)
  @Post()
  async create(
    @Param('comicSlug') comicSlug: string,
    @Body() request: ChapterCreateRequest,
  ): Promise<WebResponse<ChapterResponse>> {
    const chapter = await this.chaptersService.create(comicSlug, request);
    return {
      statusCode: 201,
      success: true,
      data: chapter,
    };
  }

  @Public()
  @HttpCode(200)
  @Get()
  async findAll(
    @Param('comicSlug') comicSlug: string,
  ): Promise<WebResponse<ChapterResponse[]>> {
    const chapter = await this.chaptersService.findAll(comicSlug);
    return {
      statusCode: 200,
      success: true,
      data: chapter,
    };
  }

  @Public()
  @Get(':chapterSlug')
  async findOne(
    @Param('chapterSlug') chapterSlug: string,
    @Param('comicSlug') comicSlug: string,
  ) {
    const chapter = await this.chaptersService.findOne(comicSlug, chapterSlug);
    return {
      statusCode: 200,
      success: true,
      data: chapter,
    };
  }

  @Roles('super', 'admin')
  @HttpCode(201)
  @Patch(':id')
  async update(
    @Param('comicSlug') comicSlug: string,
    @Param('id') id: string,
    @Body() request: ChapterUpdateRequest,
  ): Promise<WebResponse<ChapterResponse>> {
    const chapter = await this.chaptersService.update(comicSlug, {
      id,
      ...request,
    });
    return {
      statusCode: 201,
      success: true,
      data: chapter,
    };
  }

  @ApiOperation({ summary: 'Delete chapter(s) by slug(s)' })
  @Roles('super', 'admin')
  @HttpCode(200)
  @Delete(':slugOrSlugs')
  async remove(
    @Param('comicSlug') comicSlug: string,
    @Param('slugOrSlugs') slugOrSlugs: string,
  ) {
    const chapters = await this.chaptersService.remove(comicSlug, slugOrSlugs);
    return {
      statusCode: 200,
      success: true,
      message: `Chapter ${slugOrSlugs} on comic ${comicSlug} has been deleted successfully`,
      data: chapters,
    };
  }
}
