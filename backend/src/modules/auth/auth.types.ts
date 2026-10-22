export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IAuthResponse {
  token: string;
  admin: {
    id: number;
    email: string;
  };
}

export interface IJwtPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}