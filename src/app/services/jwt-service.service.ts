import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as TokenActions from '../store/auth/auth.actions';
import { selectToken } from '../store/auth/auth.selector';

@Injectable({
  providedIn: 'root'
})
export class JwtServiceService {
  constructor(private store: Store) {}

  setToken(token: string): void {
    this.store.dispatch(TokenActions.setToken({ token }));
  }

  getToken(): Observable<string | null> {
    return this.store.select(selectToken);
  }

  clearToken(): void {
    this.store.dispatch(TokenActions.clearToken());
  }
}
