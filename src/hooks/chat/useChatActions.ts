
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
        content: "*He sits at his desk, fingers drumming on the polished wood, eyes fixed on the door as you enter.* \"Three fucking weeks of silence, baby. Do you know how many times I've called? *His jaw clenches, voice rough with emotion.* Every day I waited, hoping you'd answer. Why'd you shut me out?\"",
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
