import { ValidationService } from './../validation/validation.service';
import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserRequest, UserResponse } from 'src/model/user.model';
import { UserValidation } from './user.validation';

@Injectable()
export class UsersService {
  constructor(
    private validationService: ValidationService,
    private prisma: PrismaService,
  ) {}

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
}
