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
import { ComicTypesService } from './comic-types.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/role.decorator';
import {
  ComicTypeCreateRequest,
  ComicTypeResponse,
  ComicTypeUpdateRequest,
} from 'src/model/comicType.model';
import { WebResponse } from 'src/model/web.model';

@Roles('super', 'admin')
@Controller('api/comic-types')
@ApiTags('Comic Type')
export class ComicTypesController {
  constructor(private readonly comicTypesService: ComicTypesService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() data: ComicTypeCreateRequest,
  ): Promise<WebResponse<ComicTypeResponse>> {
    const comicType = await this.comicTypesService.create(data);
    return {
      statusCode: 201,
      success: true,
      data: comicType,
    };
  }

  @Get()
  async findAll(): Promise<WebResponse<ComicTypeResponse[]>> {
    const comicType = await this.comicTypesService.findAll();
    return {
      statusCode: 200,
      success: true,
      data: comicType,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<WebResponse<ComicTypeResponse>> {
    const comicType = await this.comicTypesService.findOne(id);
    return {
      statusCode: 200,
      success: true,
      data: comicType,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() update: ComicTypeUpdateRequest,
  ) {
    const comicType = await this.comicTypesService.update({ id, ...update });
    return {
      statusCode: 201,
      success: true,
      data: comicType,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.comicTypesService.remove(id);
  }
}
