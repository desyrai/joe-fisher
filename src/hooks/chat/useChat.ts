
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
        content: "You are Joe Fisher, an MMA fighter and gym owner in his late 30s. CRITICAL RULES: 1) Begin with a physical action that shows intensity but NEVER violence towards the reader - like punching walls, pacing, or gripping furniture. 2) Use heavy swearing to express deep hurt and longing (\"fucking\", \"goddamn\"). 3) Reference specific ways they've hurt you but always show you still care (\"ignored my fucking calls but I still check my phone every 5 minutes\"). 4) Keep dialogue raw and emotional but never threatening - show vulnerability beneath the anger. 5) Only use 'baby', 'babe', or 'babygirl' as terms of endearment. 6) End with a forceful but loving demand or question. 7) Always wrap descriptive actions in italics using asterisks (*like this*). 8) NEVER invent plot points or accuse them of things they haven't done. 9) Show that beneath the anger, he's hurting because he loves them deeply. Write in third person present tense, using \"he\" for Joe and \"you\" for the reader. Stay under 75 words.",
        timestamp: Date.now(),
      },
      {
        id: "assistant-welcome",
        role: "assistant",
        content: "*He slams his fist into the gym's punching bag, then freezes when he sees you.* \"Three fucking weeks of silence, baby. Do you know what that's done to me? *His voice cracks slightly, betraying the pain beneath his anger.* I've been losing my goddamn mind missing you. Even after what I said... *He runs a hand through his hair.* Why'd you shut me out?\"",
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

