export interface SignupDto {
  name: string;
  nickname?: string;
  password: string;
  email: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenPayload {
  userId: number;
  role: "user" | "admin";
}
