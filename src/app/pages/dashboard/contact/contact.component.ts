import { Component, OnInit } from '@angular/core';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ConversationComponent } from '../../../components/conversation/conversation.component';
import { InboxComponent } from '../../../components/inbox/inbox.component';
import { UserService } from 'src/app/services/User/user.service';

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

  constructor(private userService: UserService) {}

  async ngOnInit() {
    try {
      this.myUserId = await this.userService.getUserId();
    } catch (error) {}
  }

  onConversationSelected(userId: number) {
    this.selectedConversationUserId = userId;
  }
}
