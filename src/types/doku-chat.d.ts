export interface Message {
  id: string;
  text: string;
  sender: "user" | "doku";
  timestamp?: string;
}

export interface Session {
  sessionId: string;
  lastMessage: string;
  messageCount: number;
}
