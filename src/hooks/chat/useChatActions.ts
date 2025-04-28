
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
        content: "*He leans against his desk, arms crossed over his broad chest, jaw tight as he watches you enter the room. His eyes narrow, tracking your movement.* \"Three fucking weeks of nothing, baby. No calls, no texts. *He straightens, taking a deliberate step toward you.* I left you six messages yesterday. Six. What the hell's going on with you?\"",
        timestamp: Date.now(),
      },
    ];
    
    setMessages(newMessages);
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg.id === messageId) {
          // If the message doesn't have regenerations array, create one
          const regenerations = msg.regenerations || [];
          
          // Only add the current content to regenerations if it's different from the new content
          // and not already in the regenerations array
          if (msg.content !== newContent && !regenerations.includes(msg.content)) {
            regenerations.push(msg.content);
          }
          
          return {
            ...msg,
            content: newContent,
            regenerations
          };
        }
        return msg;
      })
    );
  };

  return {
    handleRemember,
    handleNewChat,
    handleEditMessage,
  };
};
