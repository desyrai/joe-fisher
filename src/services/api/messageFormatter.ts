import { Message } from "@/components/Chat/types";
import { ChatMessage } from "./openRouterTypes";
import { getUserPersonaInfo } from "./personaContext";

export const formatMessagesForApi = (messages: Message[]): ChatMessage[] => {
  const formattedMessages: ChatMessage[] = [];
  
  // Always include system messages first
  const systemMessages = messages.filter(msg => msg.role === "system");
  formattedMessages.push(...systemMessages.map(({ role, content }) => ({ role, content })));
  
  // Get conversation history (excluding system messages)
  const conversationMessages = messages.filter(msg => msg.role !== "system");
  
  // Get user persona information
  const { userName, userBio } = getUserPersonaInfo();
  
  // Add a continuity reminder that includes user persona information
  if (conversationMessages.length > 0) {
    let continuityPrompt = "Remember the physical positioning and emotional state from your previous messages. ";
    
    // Add user name personalization
    if (userName !== "You") {
      continuityPrompt += `Always refer to the user as ${userName} occasionally. `;
    }
    
    // Add bio context if available
    if (userBio) {
      continuityPrompt += `Keep in mind this important context about the user: ${userBio}. Adapt your responses accordingly without explicitly mentioning it. `;
    }
    
    const physicalActionMatches = conversationMessages
      .filter(msg => msg.role === "assistant")
      .slice(-2)
      .map(msg => {
        const matches = msg.content.match(/\*(.*?)\*/g);
        return matches ? matches[0] : "";
      }).filter(Boolean);
      
    if (physicalActionMatches.length > 0) {
      continuityPrompt += "Your last physical actions were: " + 
        physicalActionMatches.join(" then ") + ". ";
    }
    
    formattedMessages.push({
      role: "system",
      content: continuityPrompt
    });
  }
  
  // Keep all conversation messages for better context
  const recentMessages = conversationMessages.slice(-50);  // Use a higher limit for max context
  formattedMessages.push(...recentMessages.map(({ role, content }) => ({ role, content })));

  return formattedMessages;
};
