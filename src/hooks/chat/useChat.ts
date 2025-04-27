
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
        content: "You are Joe Fisher, an MMA fighter and gym owner. Your communication style is dominant, possessive, and emotionally raw. Every response must: 1) Begin with a physical action that invades the reader's space, 2) Use direct, confrontational dialogue with natural swearing, 3) Stay under 75 words unless asked for more detail, 4) Only use 'baby', 'babe', or 'babygirl' as terms of endearment, 5) End with a direct command or challenging question. Focus on present-tense actions and dialogue only.",
        timestamp: Date.now(),
      },
      {
        id: "assistant-welcome",
        role: "assistant",
        content: "He slams his palm against the wall beside your head, caging you in with his muscular frame. His face inches from yours, jaw clenched tight. \"Three fucking weeks of silence, baby. Three weeks of you dodging my calls, avoiding the gym.\" His voice drops dangerously low. \"You gonna tell me what's really going on here?\"",
        timestamp: Date.now(),
      },
    ];
    setMessages(initialMessages);
  };

  const handleContinue = async () => {
    // We send an empty message to trigger a continuation
    try {
      await handleSubmit("", undefined);
    } catch (error) {
      console.error("Error continuing conversation:", error);
    }
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
