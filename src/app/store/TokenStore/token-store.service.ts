import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenStoreService {
  private readonly tokenKey = 'token';

  constructor() {}

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return this.isTokenValid(token);
  }

  private isTokenValid(token: string | null): boolean {
    if (!token) {
      return false;
    }

    // try {
    //   const decodedToken = jwtDecode<JwtPayload>(token);
    //   const currentTime = Math.floor(Date.now() / 1000);
    //   if (decodedToken.exp && decodedToken.exp > currentTime) {
    //     return true;
    //   } else {
    //     this.clearToken(); // Ako je token istekao, obriši ga
    //     return false;
    //   }
    // } catch (error) {
    //   // Ako dekodiranje tokena ne uspe, token se smatra nevažećim
    //   this.clearToken();
    //   return false;
    // }
    return true;
  }
}
