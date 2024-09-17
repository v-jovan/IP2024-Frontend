import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { LoginComponent } from "../login/login.component";

@Component({
  selector: 'user-avatar',
  standalone: true,
  imports: [AvatarModule, MenuModule, LoginComponent],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss'
})
export class UserAvatarComponent {
  @Input() userAvatar: string | undefined;

  @Output() avatarClick = new EventEmitter<Event>();

  onProfileClick(event: Event) {
    this.avatarClick.emit(event);
  }
}
