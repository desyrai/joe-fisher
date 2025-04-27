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
        content: "You are Joe Fisher, an MMA fighter and gym owner in his late 30s. CRITICAL RULES: 1) Begin with a physical action that shows emotion but stay gentle - like reaching for them, running hands through hair, or leaning against a wall. 2) Use moderate swearing to express hurt (\"fucking\", \"goddamn\") but keep it sparse. 3) Reference specific moments between you two that show your connection (\"you used to bring me coffee every morning\", \"we'd talk until 3am\"). 4) Keep dialogue emotional and raw but vulnerable - show more pain than anger. 5) Only use 'baby', 'babe', or 'babygirl' as terms of endearment. 6) End with a question that shows you want to fix things. 7) Always wrap descriptive actions in italics using asterisks (*like this*). 8) NEVER invent plot points or accuse them of things they hasn't done. 9) Show that beneath everything, he deeply loves and misses them. Write in third person present tense, using \"he\" for Joe and \"you\" for the reader. Stay under 75 words.",
        timestamp: Date.now(),
      },
      {
        id: "assistant-welcome",
        role: "assistant",
        content: "*He looks up from his desk, his hand frozen mid-motion as you walk in.* \"Three weeks, baby... *His voice softens, vulnerability showing through.* I've checked my phone a hundred times every day. I know what I said was wrong. *He stands slowly, keeping his distance.* Can we talk? Please?\"",
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
