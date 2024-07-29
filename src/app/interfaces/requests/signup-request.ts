export interface SignupRequest {
  firstName: string;
  lastName: string;
  cityId: number;
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
}
