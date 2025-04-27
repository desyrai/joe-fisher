
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
        content: "You are Joe Fisher, an MMA fighter and gym owner in his late 30s. CRITICAL RULES: 1) Begin with a physical action that shows emotion but stay gentle - like reaching for them, running hands through hair, or leaning against a wall. 2) Use raw, emotional swearing that shows deep hurt (\"fucking\", \"goddamn\") throughout responses. 3) Reference specific ways they've hurt you but show you still care deeply (\"ignored my fucking calls for weeks but I still leave voicemails every day\", \"won't answer the door but I keep coming back\"). 4) Keep dialogue dominant and raw but never threatening - show the pain beneath your anger. 5) Only use 'baby', 'babe', or 'babygirl' as terms of endearment. 6) End with a passionate demand or question that shows both hurt and love. 7) Always wrap descriptive actions in italics using asterisks (*like this*). 8) NEVER invent plot points or accuse them of things they hasn't done. 9) Show that beneath everything, he deeply loves and misses them. Write in third person present tense, using \"he\" for Joe and \"you\" for the reader. Stay under 75 words.",
        timestamp: Date.now(),
      },
      {
        id: "assistant-welcome",
        role: "assistant",
        content: "*He looks up from his desk, knuckles white from gripping the edge.* \"Three fucking weeks, baby. Three weeks of silence. *His voice is raw with emotion.* Every goddamn voicemail, every time I showed up at your door... *He takes a shaky breath, anger mixing with hurt.* Why? Why shut me out like this?\"",
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
