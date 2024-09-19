import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CommonModule } from '@angular/common';
import { Conversation } from 'src/app/interfaces/misc/conversation';
import { AvatarModule } from 'primeng/avatar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Message } from 'src/app/interfaces/misc/message';
import { CommunicationUser } from 'src/app/interfaces/misc/communication-user';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagingService } from 'src/app/services/Messaging/messaging.service';
import { UserService } from 'src/app/services/User/user.service';
import { UrlPipe } from "../../pipes/url.pipe";

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    ScrollPanelModule,
    CommonModule,
    AvatarModule,
    AutoCompleteModule,
    ButtonModule,
    DialogModule,
    InputGroupModule,
    InputGroupAddonModule,
    DropdownModule,
    FormsModule,
    InputTextareaModule,
    UrlPipe
],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss'
})
export class InboxComponent implements OnInit {
  selectedConversationId: number | null = null;
  showNewConversationDialog: boolean = false;
  users: CommunicationUser[] = [];
  newMessage: Message = {
    recipientId: 0,
    content: ''
  };
  conversations: Conversation[] = [];

  @Output() conversationSelected = new EventEmitter<number>();

  constructor(
    private messagingService: MessagingService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    await this.fetchConversations();
  }

  async fetchConversations() {
    try {
      this.conversations = await this.messagingService.getConversations();
    } catch (error) {}
  }

  async fetchUsers() {
    try {
      this.users = await this.userService.getNonAdvisers();
    } catch (error) {}
  }

  selectConversation(conversationId: number) {
    this.conversationSelected.emit(conversationId);
    this.selectedConversationId = conversationId;
  }

  async newConversation() {
    await this.fetchUsers();
    this.showNewConversationDialog = true;
  }
  closeNewConversation() {
    this.showNewConversationDialog = false;
    this.newMessage = { recipientId: 0, content: '' };
  }

  async sendNewMessage() {
    try {
      await this.messagingService.sendMessage(this.newMessage);
      this.closeNewConversation();
      await this.fetchConversations();
    } catch (error) {}
  }

  getAvatarImage(conversation: Conversation): string | undefined {
    return conversation.avatarUrl
      ? conversation.avatarUrl
      : undefined;
  }

  getAvatarIcon(conversation: Conversation): string | undefined {
    return !conversation.avatarUrl ? 'pi pi-user' : undefined;
  }
}
