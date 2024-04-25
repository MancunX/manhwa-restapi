import { UsersService } from './users.service';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserRequest, UserResponse } from '../model/user.model';
import { WebResponse } from 'src/model/web.model';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
