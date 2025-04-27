
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
        content: "He *grabs your wrist hard*, yanking you into the empty hallway. *His muscular frame blocks any escape*. \"Done avoiding me now, huh? Three fucking weeks of ignored texts, and now you just waltz in?\" *His jaw tightens, veins visible on his neck*. \"Talk. Right fucking now. What's your excuse this time, baby?\"",
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
