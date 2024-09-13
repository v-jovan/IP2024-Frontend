export interface Message {
  id?: number;
  senderId?: number;
  recipientId: number;
  subject?: string;
  content: string;
  sentAt?: string;
  readAt?: string | null;
}
