import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ScrollPanel, ScrollPanelModule } from 'primeng/scrollpanel';
import { Message } from 'src/app/interfaces/misc/message';
import { MessagingService } from 'src/app/services/Messaging/messaging.service';
import { CommonModule } from '@angular/common';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ErrorInterceptorService } from 'src/app/interceptors/error.interceptor';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [
    ScrollPanelModule,
    CommonModule,
    InputTextareaModule,
    ButtonModule,
    FormsModule
  ],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent implements OnChanges {
  @Input() conversationUserId: number | null = null;
  @Input() userId: number | null = 0;
  @ViewChild('scrollPanel') scrollPanel!: ScrollPanel;
  newMessage: string = '';
  messages: Message[] = [];

  constructor(
    private messagingService: MessagingService,
    private errorInterceptorService: ErrorInterceptorService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['conversationUserId']) {
      this.loadConversation();
    }
  }
  async loadConversation() {
    if (this.conversationUserId) {
      try {
        this.messages = await this.messagingService.getMessagesForConversation(
          this.conversationUserId
        );
      } catch (error) {
        this.errorInterceptorService.handleError(error as AxiosError);
      }

      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
    }
  }

  scrollToBottom() {
    const scrollContent = this.scrollPanel?.contentViewChild?.nativeElement;
    scrollContent.scrollTop = scrollContent.scrollHeight;
  }

  async sendMessage() {
    try {
      await this.messagingService.sendMessage({
        recipientId: this.conversationUserId as number,
        content: this.newMessage
      });
      this.newMessage = '';
      await this.loadConversation();
    } catch (error) {
      this.errorInterceptorService.handleError(error as AxiosError);
    }
  }
}
