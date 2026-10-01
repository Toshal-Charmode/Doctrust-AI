export interface User {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  created_at?: Date;
}
