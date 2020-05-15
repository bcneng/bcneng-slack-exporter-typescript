export interface Message {
    userId: string;
    text: string;
    replies?: number;
    avatar?: string;
    date: Date;
  }
