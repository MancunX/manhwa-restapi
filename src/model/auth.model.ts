export class SignInResponse {
  access_token: string;
  refresh_token: string;
}

export class SignInRequest {
  email: string;
  username: string;
  password: string;
}

export class RefreshTokenResponse {
  access_token: string;
}

export class AuthProfileResponse {
  id: string;
  name: string;
  role: string;
  isOnline: boolean;
}

export class AuthChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
