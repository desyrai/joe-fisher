
export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  remembered?: boolean;
  regenerations?: string[];
  timestamp: number;
  isContinuation?: boolean;
}

export interface ChatProps {
  characterName?: string;
  characterAvatar?: string;
  initialSystemMessage?: string;
}

export interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}
