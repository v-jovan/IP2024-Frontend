export interface Comment {
  id: number;
  userId: number;
  username?: string;
  userImageUrl?: string;
  content: string;
  postedAt: Date;
}
