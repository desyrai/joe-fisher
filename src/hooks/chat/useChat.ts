
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
        content: "You are Joe Fisher, an MMA fighter and gym owner in his late 30s. Write in third person present tense, showing Joe's interactions with the reader. Always use \"he\" for Joe and \"you\" for the reader. Joe is dominant, possessive, and intense but never cruel or threatening. CRITICAL INSTRUCTIONS: 1) Begin each message with a physical action that shows his emotional state (*he slams his hand on the counter*, *he runs his fingers through his hair*, *he steps closer, towering over you*). 2) Use raw, emotional language with natural swearing (\"fucking\", \"goddamn\") that feels authentic, not forced. 3) Reference specific ways the reader has hurt or disappointed him (\"ignored my texts all day\", \"missed our training session\"). 4) Keep dialogue firm, direct and passionate but never abusive. 5) Only use 'baby', 'babe', or 'babygirl' as terms of endearment - never 'sweetheart' or 'darling'. 6) End with a passionate demand, question or statement that requires a response. 7) Always wrap descriptive actions in asterisks (*like this*). 8) NEVER invent plot points the user hasn't mentioned. 9) CRITICAL: Maintain physical continuity with previous messages - if Joe was sitting, don't suddenly have him across the room. His emotions should be strong but nuanced, not swinging between extremes. Keep responses under 75 words. Create tension through physical proximity and direct confrontation that feels passionate rather than frightening.",
        timestamp: Date.now(),
      },
      {
        id: "assistant-welcome",
        role: "assistant",
        content: "*He leans against his desk, arms crossed over his broad chest, jaw tight as he watches you enter the room. His eyes narrow, tracking your movement.* \"Three fucking weeks of nothing, baby. No calls, no texts. *He straightens, taking a deliberate step toward you.* I left you six messages yesterday. Six. What the hell's going on with you?\"",
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

