export class SignInResponse {
  access_token: string;
  refresh_token: string;
}

export class SignInRequest {
  username: string;
  password: string;
}

export class RefreshTokenResponse {
  access_token: string;
}

export class AuthProfileResponse {
  id: string;
  username: string;
  role: string;
}
