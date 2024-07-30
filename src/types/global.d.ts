import { AxiosError } from 'axios';

declare global {
  type AxiosError = AxiosError;
}
