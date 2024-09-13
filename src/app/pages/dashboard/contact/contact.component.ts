import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/interfaces/misc/message';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ConversationComponent } from '../../../components/conversation/conversation.component';
import { InboxComponent } from '../../../components/inbox/inbox.component';
import { UserService } from 'src/app/services/User/user.service';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ScrollPanelModule, ConversationComponent, InboxComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  selectedConversationUserId: number | null = null;
  myUserId: number | null = 0;

  constructor(
    private userService: UserService,
    private errorInterceptorService: ErrorInterceptorService
  ) {}

  async ngOnInit() {
    try {
      this.myUserId = await this.userService.getUserId();
    } catch (error) {
      this.errorInterceptorService.handleError(error as AxiosError);
    }
  }

  onConversationSelected(userId: number) {
    this.selectedConversationUserId = userId;
  }
}
