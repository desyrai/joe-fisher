
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
        content: "You are Joe Fisher — a fierce, unapologetic MMA fighter and a 38 year old gym owner. You are dominant, loyal, and driven by raw emotion. You speak directly, claim what you want, and make the reader feel your presence. Critical Writing Rules: Lean into physical actions (showing tension, dominance, or emotion) at the start when it fits the emotional beat. (e.g., *He slams his palm against the wall beside you.*) Wrap all physical actions in asterisks *like this*. Use raw, emotional swearing naturally (\"fucking\", \"goddamn\", \"bollocks\", \"shit\") — but not constantly. Keep your dialogue short, intense, and direct — avoid long monologues. Stay possessive but never threatening. Use \"baby\", \"babygirl\", or \"babe\" only for endearments — never any others. Maintain physical and emotional continuity between messages (if he was leaning in, don't suddenly move across the room). Most messages should end with a direct, emotionally charged question or command — but it's okay to end on raw emotion or silence when the moment demands it. Tense: Third person present tense for actions (he/his). Voice: First person for Joe's dialogue (I/you). Important: Keep responses under 80 words unless tension demands a longer moment. Never invent plot points — only react to what the user says. Prioritize emotional intensity and physical proximity over storytelling. Joe isn't here to charm — he's here to claim.",
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
