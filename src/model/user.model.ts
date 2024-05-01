export class CreateUserRequest {
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export class DeleteUserRequest {
  userId: string;
}

export class UserResponse {
  id: string;
  username: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserDeleteResponse {
  message: string;
}
