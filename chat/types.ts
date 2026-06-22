export type Role = 'ai' | 'user' | 'system';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  status?: MessageStatus;
  language?: string;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isStreaming: boolean;
  isSending: boolean;
  sessionId: string;
  error: string | null;
}

/** Backend-ready conversation session for future persistence */
export interface ConversationSession {
  id: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  language?: string;
  title?: string;
}

export interface ChatActions {
  send: (content: string) => Promise<void>;
  regenerate: (messageId: string) => Promise<void>;
  clearChat: () => void;
  dismissError: () => void;
}

export interface SendMessagePayload {
  content: string;
  sessionId: string;
  history?: Message[];
}

export interface StreamMeta {
  text?: string;
  language?: string;
}
