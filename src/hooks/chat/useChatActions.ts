
import { Message } from "@/components/Chat/types";
import { toggleRememberMessage } from "./utils/rememberMessage";
import { createNewChat } from "./utils/newChatCreator";
import { editMessageContent } from "./utils/messageEditor";

export const useChatActions = (setMessages: React.Dispatch<React.SetStateAction<Message[]>>) => {
  const handleRemember = (messageId: string) => {
    setMessages((prevMessages) => toggleRememberMessage(prevMessages, messageId));
  };

  const handleNewChat = (messages: Message[]) => {
    setMessages(createNewChat(messages));
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages((prevMessages) => editMessageContent(prevMessages, messageId, newContent));
  };

  return {
    handleRemember,
    handleNewChat,
    handleEditMessage,
  };
};
