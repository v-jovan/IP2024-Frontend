import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarVisibility = new Subject<boolean>();
  sidebarVisibility$ = this.sidebarVisibility.asObservable();

  setSidebarVisibility(isVisible: boolean) {
    this.sidebarVisibility.next(isVisible);
  }
}
