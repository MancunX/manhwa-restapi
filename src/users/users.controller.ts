import { UsersService } from './users.service';
import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CreateUserRequest, UserResponse } from '../model/user.model';
import { WebResponse } from 'src/model/web.model';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}
