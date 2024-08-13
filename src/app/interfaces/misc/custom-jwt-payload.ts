export interface CustomJwtPayload {
  email?: string;
  roles?: string[];
  [key: string]: any;
}
