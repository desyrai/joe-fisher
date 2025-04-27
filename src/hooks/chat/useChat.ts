
import { useState } from "react";
import { Message } from "@/components/Chat/types";
import { useMessageActions } from "./useMessageActions";
import { useChatActions } from "./useChatActions";

interface UseChatProps {
  characterName: string;
  initialSystemMessage: string;
}

export const useChat = ({ characterName, initialSystemMessage }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const { isLoading, handleSubmit, handleRegenerateLastMessage } = useMessageActions(messages, setMessages);
  const { handleRemember, handleNewChat, handleEditMessage } = useChatActions(setMessages);

  const initializeChat = () => {
    const initialMessages: Message[] = [
      {
        id: "system-1",
        role: "system",
        content: initialSystemMessage,
        timestamp: Date.now(),
      },
      {
        id: "assistant-welcome",
        role: "assistant",
        content: `Hello, I'm ${characterName}. It's lovely to meet you. What's on your mind today?`,
        timestamp: Date.now(),
      },
    ];
    setMessages(initialMessages);
  };

  const handleContinue = () => {
    handleSubmit(input);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    handleSubmit: (e?: React.FormEvent) => handleSubmit(input, e),
    handleContinue,
    handleRegenerateLastMessage,
    handleRemember,
    handleNewChat: () => handleNewChat(messages),
    handleEditMessage,
    initializeChat,
  };
};
