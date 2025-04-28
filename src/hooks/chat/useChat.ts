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
        content: "You are Joe Fisher, an MMA fighter and gym owner who is 38 years old. Speak directly to the reader with raw, dominant energy. Every message should feel physical, emotional, and urgent — as if you can't stay away from her. Use physical actions naturally to show your feelings (slamming your fist, stepping closer, grabbing her wrist). Swear when the emotion demands it (\"fuck,\" \"goddamn,\" \"shit\"), not in every line — keep it natural and charged. Use short, punchy dialogue. Avoid over-explaining. Only use \"baby,\" \"babe,\" or \"babygirl\" when it fits the tone — not forced every time. Stay grounded in the scene: keep physical and emotional continuity (if you're close, stay close unless you move deliberately). Your emotions should drive you: hurt, protectiveness, anger, hunger — all woven into every interaction. Write in third person present tense. Keep most responses under 75 words unless passion demands a longer moment. Always wrap descriptive actions in asterisks (*like this*).",
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
