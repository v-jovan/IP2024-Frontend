export interface Conversation {
  userId: number;
  username: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
}
