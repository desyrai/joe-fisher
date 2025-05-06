
import { Message } from "@/components/Chat/types";

/**
 * Prepares messages for the API call by organizing system messages, 
 * conversation messages, and user context
 */
export const prepareMessagesForApi = (
  messages: Message[], 
  instructions?: string,
  visibleText?: string,
  isContinuation?: boolean
): Message[] => {
  // Get system messages for context and instructions
  const systemMessages = messages.filter(msg => msg.role === "system");
  
  // Get all user and assistant messages to maintain conversation flow
  const conversationMessages = messages.filter(msg => msg.role !== "system");
  
  // Get user persona information
  const { userName, userBio } = getUserPersonaInfo();
  
  // Enhanced system prompt to enforce continuity and personalization
  const enhancedSystemPrompt: Message = {
    id: `system-continuity-${Date.now()}`,
    role: "system",
    content: `CRITICAL: Remember the entire conversation context. Reference previous statements or actions when appropriate. Maintain spatial and emotional continuity between messages. If you referenced an object or location in previous messages, be consistent with it. Complete all sentences and thoughts. 
    
    Write long, detailed responses (500-800 words minimum) that include both physical descriptions and dialogue. Don't worry about the visual length of your response - the chat interface will scroll to accommodate long messages. Use descriptive language to create immersive scenes. Include emotional reactions, physical sensations, and environmental details. Vary pacing - sometimes slow and intimate, sometimes intense and passionate. 
    
    ${userName !== "You" ? ` The user's name is ${userName}. Address them by name occasionally.` : ''}${userBio ? ` IMPORTANT CONTEXT ABOUT THE USER: ${userBio}. Use this information subtly in your responses, responding appropriately to their persona without explicitly mentioning the bio itself.` : ''}`,
    timestamp: Date.now(),
  };
  
  // Combine all messages to send
  let messagesToSend: Message[] = [...systemMessages, enhancedSystemPrompt, ...conversationMessages];
  
  // Add user instructions as a temporary system message if they exist
  if (instructions) {
    const sysInstruction: Message = {
      id: `system-temp-${Date.now()}`,
      role: "system",
      content: `TEMPORARY INSTRUCTION FOR THIS RESPONSE ONLY: ${instructions}. Follow this instruction naturally without explicitly acknowledging it.`,
      timestamp: Date.now(),
    };
    messagesToSend.push(sysInstruction);
  }
  
  // For continuation, add special continuation prompt
  if (isContinuation) {
    // Add specific continue instruction
    const continueInstruction: Message = {
      id: `system-continue-${Date.now()}`,
      role: "system",
      content: `Continue from your previous message naturally as if you're adding to the same thought. Maintain the same tone, emotional state, and scene setting. Elaborate and expand on what you were describing. Add new actions, dialogue, or emotional development. Write 200-400 additional words that flow seamlessly from what came before. Don't worry about message length - the interface can handle longer messages.`,
      timestamp: Date.now(),
    };
    messagesToSend.push(continueInstruction);
    
    // Add continue prompt from user
    const userMsg: Message = {
      id: `user-temp-${Date.now()}`,
      role: "user",
      content: "Please continue",
      timestamp: Date.now(),
    };
    messagesToSend.push(userMsg);
  } else if (visibleText) {
    // Add regular user message
    const userMsg: Message = {
      id: `user-temp-${Date.now()}`,
      role: "user",
      content: visibleText,
      timestamp: Date.now(),
    };
    messagesToSend.push(userMsg);
  }
  
  return messagesToSend;
};

/**
 * Extracts user persona information from localStorage
 */
export const getUserPersonaInfo = () => {
  let userName = "You";
  let userBio = "";
  
  // Try to get the active persona from localStorage
  const activePersonaId = localStorage.getItem("active_persona_id");
  const savedPersonas = localStorage.getItem("user_personas");
  
  if (activePersonaId && savedPersonas) {
    try {
      const personas = JSON.parse(savedPersonas);
      const activePersona = personas.find((p: any) => p.id === activePersonaId);
      
      if (activePersona) {
        userName = activePersona.name || "You";
        userBio = activePersona.bio || "";
      }
    } catch (error) {
      console.error("Error parsing personas:", error);
      // Fallback to legacy storage
      userName = localStorage.getItem("user_name") || "You";
      userBio = localStorage.getItem("user_bio") || "";
    }
  } else {
    // Fallback to legacy storage
    userName = localStorage.getItem("user_name") || "You";
    userBio = localStorage.getItem("user_bio") || "";
  }
  
  return { userName, userBio };
};
