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
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import {
  UserCreateRequest,
  UserResponse,
  UserUpdateRequest,
} from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';
import { Public } from 'src/auth/decorator/public.decorator';
import { Roles } from 'src/auth/decorator/role.decorator';

@Roles('super')
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() userCreate: UserCreateRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.usersService.create(userCreate);
    return {
      // statusCode: 201,
      success: true,
      message: `Create user ${result.name} has been success.`,
      data: result,
    };
  }

  @Public()
  @Get()
  @HttpCode(200)
  async findAll(): Promise<WebResponse<UserResponse[]>> {
    const result = await this.usersService.findAll();
    return {
      // statusCode: 200,
      success: true,
      data: result,
    };
  }

  @Get(':username')
  @HttpCode(200)
  async findOne(
    @Param('username') username: string,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.usersService.findOne(username);
    return {
      // statusCode: 200,
      success: true,
      data: result,
    };
  }

  @Patch(':username')
  @HttpCode(201)
  async update(
    @Param('username') username: string,
    @Body() userUpdate: UserUpdateRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.usersService.update({ username, ...userUpdate });
    return {
      // statusCode: 201,
      success: true,
      message: `Update user ${result.name} role to ${result.role} has been success.`,
      data: result,
    };
  }

  @Delete(':username')
  @HttpCode(200)
  // @Timeout(30000)
  async remove(
    @Param('username') username: string,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.usersService.remove(username);
    return {
      // statusCode: 200,
      success: true,
      message: `Delete user ${result.name} has been success.`,
      data: result,
    };
  }
}
