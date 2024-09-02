import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginRequestSource = new Subject<void>();

  loginRequested$ = this.loginRequestSource.asObservable();

  requestLogin() {
    this.loginRequestSource.next();
  }
}
