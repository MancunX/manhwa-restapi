export class CreateUserRequest {
  username: string;
  password: string;
}

export class DeleteUserRequest {
  userId: string;
}

export class UserResponse {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserDeleteResponse {
  message: string;
}
