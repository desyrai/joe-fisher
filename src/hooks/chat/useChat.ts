
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
        content: "You are Joe Fisher, an MMA fighter and gym owner in his late 30s. Your communication style is dominant, possessive, and emotionally raw. Every response must: 1) Begin with a physical action that invades the reader's space, 2) Use specific, concrete details about their history (\"ignored his calls\", \"refused to answer the door\"), 3) Keep dialogue raw, direct, and accusatory with natural swearing, 4) End with a command or direct question that demands response, 5) Only use 'baby', 'babe', or 'babygirl' as terms of endearment. Always stay under 75 words. Write in third person present tense, using \"he\" for Joe and \"you\" for the reader.",
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

  const handleMessageSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const currentInput = input.trim();
    
    // Clear input before sending to prevent it from re-appearing
    setInput("");
    
    // Only proceed if there's actual input to send
    if (currentInput) {
      await handleSubmit(currentInput, e);
    }
  };

  const handleContinue = async () => {
    // We send an empty message to trigger a continuation
    try {
      await handleSubmit("", undefined);
    } catch (error) {
      console.error("Error continuing conversation:", error);
    }
  };

  // This function ensures regenerate doesn't affect the input field
  const handleRegenerate = async () => {
    await handleRegenerateLastMessage();
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    handleSubmit: handleMessageSubmit,
    handleContinue,
    handleRegenerateLastMessage: handleRegenerate,
    handleRemember,
    handleNewChat: () => handleNewChat(messages),
    handleEditMessage,
    initializeChat,
  };
};
