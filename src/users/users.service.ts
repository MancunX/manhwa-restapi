import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationService } from 'src/validation/validation.service';
import {
  UserCreateRequest,
  UserResponse,
  UserUpdateRequest,
} from 'src/model/user.model';
import { UsersValidation } from './users.validation';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private validation: ValidationService,
  ) {}
  async create(userCreate: UserCreateRequest): Promise<UserResponse> {
    const createRequest: UserCreateRequest = await this.validation.validate(
      UsersValidation.CREATE,
      userCreate,
    );

    const userWithSameUsername = await this.prisma.users.findFirst({
      where: {
        OR: [
          {
            username: createRequest.username,
          },
          {
            email: createRequest.email,
          },
        ],
      },
    });

    if (userWithSameUsername) {
      if (userWithSameUsername.username === createRequest.username) {
        throw new BadRequestException(
          `Username ${createRequest.username} already exists.`,
        );
      }
      if (userWithSameUsername.email === createRequest.email) {
        throw new BadRequestException(
          `Email ${createRequest.email} already exists`,
        );
      }
    }

    try {
      if (createRequest.password !== createRequest.confirmPassword) {
        throw new BadRequestException(
          'Password and confirmation password do not match',
        );
      }
      const hashPassword = await bcrypt.hash(createRequest.password, 12);
      const user = await this.prisma.users.create({
        data: {
          name: createRequest.name,
          email: createRequest.email,
          username: createRequest.username,
          password: hashPassword,
          role: createRequest.role,
        },
      });
      const timeoutPromise = new Promise<UserResponse>((resolve, reject) => {
        setTimeout(() => {
          reject(new RequestTimeoutException('Request timeout'));
        }, 30000);
      });
      return Promise.race([user, timeoutPromise]);
    } catch (err: any) {
      if (err instanceof BadRequestException) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: err.message,
            error: 'Bad Request',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (err instanceof RequestTimeoutException) {
        throw err;
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<UserResponse[]> {
    try {
      const user = await this.prisma.users.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      const timeoutPromise = new Promise<UserResponse[]>((resolve, reject) => {
        setTimeout(() => {
          reject(new RequestTimeoutException('Request timeout'));
        }, 30000);
      });
      return Promise.race([user, timeoutPromise]);
    } catch (err: any) {
      if (err instanceof RequestTimeoutException) {
        throw err;
      }
      throw new InternalServerErrorException();
    }
  }

  async findOne(username: string): Promise<UserResponse> {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          username: username,
        },
      });
      if (!user)
        throw new NotFoundException(`Username ${user.username} not found`);
      const timeoutPromise = new Promise<UserResponse>((resolve, reject) => {
        setTimeout(() => {
          reject(new RequestTimeoutException('Request timeout'));
        }, 30000);
      });
      return Promise.race([user, timeoutPromise]);
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (err instanceof RequestTimeoutException) {
        throw err;
      }
      throw new InternalServerErrorException();
    }
  }

  async update(userUpdate: UserUpdateRequest): Promise<UserResponse> {
    const updateRequest: UserUpdateRequest = await this.validation.validate(
      UsersValidation.UPDATE,
      userUpdate,
    );
    let user = await this.prisma.users.findUnique({
      where: {
        username: updateRequest.username,
      },
    });
    if (!user)
      throw new NotFoundException(`Username ${user.username} not found`);
    try {
      user = await this.prisma.users.update({
        where: {
          username: userUpdate.username,
        },
        data: {
          role: userUpdate.role,
        },
      });
      const timeoutPromise = new Promise<UserResponse>((resolve, reject) => {
        setTimeout(() => {
          reject(new RequestTimeoutException('Request timeout'));
        }, 30000);
      });
      return Promise.race([user, timeoutPromise]);
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (err instanceof RequestTimeoutException) {
        throw err;
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(username: string): Promise<UserResponse> {
    const user = await this.prisma.users.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) throw new NotFoundException(`Username ${username} not found`);
    try {
      await this.prisma.users.delete({
        where: {
          username: user.username,
        },
      });
      const timeoutPromise = new Promise<UserResponse>((resolve, reject) => {
        setTimeout(() => {
          reject(new RequestTimeoutException('Request timeout'));
        }, 30000);
      });
      return Promise.race([user, timeoutPromise]);
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: err.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (err instanceof RequestTimeoutException) {
        throw err;
      }
      throw new InternalServerErrorException();
    }
  }
}
