
import { Message } from "@/components/Chat/types";

export const useChatActions = (setMessages: React.Dispatch<React.SetStateAction<Message[]>>) => {
  const handleRemember = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, remembered: !msg.remembered } : msg
      )
    );
  };

  const handleNewChat = (messages: Message[]) => {
    const rememberedMessages = messages.filter(
      (msg) => msg.remembered || msg.role === "system"
    );
    
    const newMessages: Message[] = [
      ...rememberedMessages,
      {
        id: `assistant-welcome-${Date.now()}`,
        role: "assistant",
        content: `Starting a fresh conversation. Is there something specific you'd like to discuss?`,
        timestamp: Date.now(),
      },
    ];
    
    setMessages(newMessages);
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, content: newContent } : msg
      )
    );
  };

  return {
    handleRemember,
    handleNewChat,
    handleEditMessage,
  };
};
