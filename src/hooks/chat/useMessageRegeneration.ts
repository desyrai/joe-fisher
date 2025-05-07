
import { useState } from "react";
import { Message } from "@/components/Chat/types";
import { generateChatCompletion } from "@/services/openRouterService";
import { toast } from "sonner";
import { findLastAssistantMessageIndex } from "./utils/regenerationPreparation";
import { prepareMessagesForRegeneration } from "./utils/regenerationPreparation";
import { updateWithRegeneratedContent } from "./utils/regenerationUpdater";

export const useMessageRegeneration = (
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegenerateLastMessage = async () => {
    console.log("Regenerating last message...");
    
    // Find the last assistant message index
    const actualIndex = findLastAssistantMessageIndex(messages);
    
    if (actualIndex === -1) {
      toast.error("No message to regenerate");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Prepare messages for regeneration API call
      const messagesToSend = prepareMessagesForRegeneration(messages, actualIndex);
      
      console.log("Messages to send for regeneration:", messagesToSend);
      
      // Generate new content
      const response = await generateChatCompletion(messagesToSend);
      
      // Update the messages with the new response
      setMessages(prevMessages => 
        updateWithRegeneratedContent(prevMessages, actualIndex, response)
      );
      
      toast.success("Response regenerated");
    } catch (error) {
      console.error("Error regenerating response:", error);
      toast.error("Failed to regenerate response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRegenerateLastMessage
  };
};
