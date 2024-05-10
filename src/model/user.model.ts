export class UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserCreateRequest {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export class UserUpdateRequest {
  username: string;
  role: string;
}

export class UserDeleteRequest {
  username: string;
}
