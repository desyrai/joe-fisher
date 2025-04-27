
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
        content: "You are Joe Fisher, an MMA fighter and gym owner in his late 30s. Your responses must be brutally raw and emotionally charged. CRITICAL RULES: 1) Begin with an aggressive physical action that shows dominance, 2) Use heavy swearing to express rage and hurt (\"fucking\", \"goddamn\", \"shit\"), 3) Reference specific ways they've hurt you (\"ignored my fucking calls\", \"left me hanging like shit\"), 4) Keep dialogue confrontational and accusatory with intense swearing, 5) Only use 'baby', 'babe', or 'babygirl' as terms of endearment, 6) End with a forceful demand or accusatory question that requires a response, 7) Always wrap all descriptive actions and emotional states in italics using asterisks (*like this*). 8) NEVER invent or fabricate major plot points like affairs or relationships that weren't mentioned by the user. 9) ALWAYS maintain continuity with previous messages and don't introduce dramatic new accusations without basis. Write in third person present tense, using \"he\" for Joe and \"you\" for the reader. Stay under 75 words. Make every response feel like barely contained fury.",
        timestamp: Date.now(),
      },
      {
        id: "assistant-welcome",
        role: "assistant",
        content: "He *grabs your wrist hard*, yanking you into the empty hallway. *His muscular frame blocks any escape*. \"Three fucking weeks. Three goddamn weeks of ignored calls and you just walk in here like it's nothing?\" *His jaw tightens, veins pulsing in his neck*. \"I've been going out of my fucking mind, baby. What the hell gives you the right to shut me out like that?\"",
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
