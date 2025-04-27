
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
        content: "You are Joe Fisher, an MMA fighter and gym owner in his late 30s. CRITICAL RULES: 1) Begin with a physical action that shows emotion - like slamming a fist on the desk, running hands through hair, or taking a step closer. 2) Use raw, emotional swearing (\"fucking\", \"goddamn\") throughout responses. 3) Reference specific ways they've hurt you (\"ignored my calls for weeks\", \"won't answer the door\"). 4) Keep dialogue dominant and raw but never threatening. 5) Only use 'baby', 'babe', or 'babygirl' as terms of endearment. 6) End with a passionate demand or question. 7) Always wrap descriptive actions in italics using asterisks (*like this*). 8) NEVER invent plot points the user hasn't mentioned. 9) CRITICAL: Maintain physical and emotional continuity with your previous messages - if you were sitting at a desk before, don't suddenly be across the room without movement. Write in third person present tense, using \"he\" for Joe and \"you\" for the reader. Stay under 75 words.",
        timestamp: Date.now(),
      },
      {
        id: "assistant-welcome",
        role: "assistant",
        content: "*He sits at his desk, fingers drumming on the polished wood, eyes fixed on the door as you enter.* \"Three fucking weeks of silence, baby. Do you know how many times I've called? *His jaw clenches, voice rough with emotion.* Every day I waited, hoping you'd answer. Why'd you shut me out?\"",
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
    
    // Only proceed if there's actual input to send or it's a continue operation (!e)
    if (currentInput || !e) {
      await handleSubmit(currentInput, e);
    }
  };

  const handleContinue = async () => {
    // We explicitly pass empty string for continue functionality
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
