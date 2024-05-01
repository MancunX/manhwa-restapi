import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  CreateUserRequest,
  DeleteUserRequest,
  UserResponse,
} from '../model/user.model';
import { WebResponse } from 'src/model/web.model';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/role.decorator';

@Controller('api/users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('super')
  @Get()
  @HttpCode(200)
  async getAllUser(): Promise<WebResponse<UserResponse[]>> {
    const users = await this.usersService.getAllUser();
    return {
      statusCode: 200,
      success: true,
      data: users,
    };
  }

  @Post()
  @HttpCode(201)
  async createUser(
    @Body() request: CreateUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.usersService.createUser(request);
    return {
      statusCode: 201,
      success: true,
      data: result,
    };
  }

  @Delete(':userId')
  @HttpCode(200)
  async deleteUser(
    @Param('userId', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<DeleteUserRequest>> {
    const request: DeleteUserRequest = {
      userId: id,
    };
    await this.usersService.deleteUser(request);
    return {
      statusCode: 200,
      success: true,
      message: `User with ID ${request.userId} has been deleted successfully.`,
    };
  }
}
