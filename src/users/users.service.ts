import { ValidationService } from './../validation/validation.service';
import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  CreateUserRequest,
  DeleteUserRequest,
  UserResponse,
} from 'src/model/user.model';
import { UserValidation } from './user.validation';

@Injectable()
export class UsersService {
  constructor(
    private validationService: ValidationService,
    private prisma: PrismaService,
  ) {}

  async getAllUser(): Promise<UserResponse[]> {
    const users = await this.prisma.users.findMany();
    if (users.length === 0) throw new HttpException('User not found', 404);
    return users.map((user) => ({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async getById(userId: string): Promise<UserResponse> {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    });
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async createUser(request: CreateUserRequest): Promise<UserResponse> {
    const createRequest: CreateUserRequest = this.validationService.validate(
      UserValidation.CREATE,
      request,
    );
    const existingUser = await this.prisma.users.findUnique({
      where: {
        username: createRequest.username,
      },
    });
    if (existingUser) {
      throw new HttpException('Username already exist..!', 400);
    }
    createRequest.password = await bcrypt.hash(createRequest.password, 12);
    const newUser = await this.prisma.users.create({
      data: {
        ...createRequest,
      },
    });
    return {
      id: newUser.id,
      username: newUser.username,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
  }

  async deleteUser(request: DeleteUserRequest): Promise<void> {
    const existingUser = await this.prisma.users.findUnique({
      where: {
        id: request.userId,
      },
    });
    if (!existingUser)
      throw new HttpException(`Id user ${existingUser.id} is not exist`, 400);

    await this.prisma.users.delete({
      where: {
        id: existingUser.id,
      },
    });
  }
}
