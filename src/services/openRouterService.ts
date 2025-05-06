import { Message } from "@/components/Chat/types";

interface ChatCompletionRequest {
  messages: {
    role: string;
    content: string;
  }[];
  model: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  repetition_penalty?: number;
}

interface ChatCompletionResponse {
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
}

// In a real app, you'd securely store and access this
let openRouterApiKey: string | null = "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"; 
const MODEL = "qwen/qwen-plus";

export const setOpenRouterApiKey = (key: string) => {
  openRouterApiKey = key;
  localStorage.setItem("openrouter_api_key", key);
};

export const getOpenRouterApiKey = (): string | null => {
  if (!openRouterApiKey) {
    openRouterApiKey = localStorage.getItem("openrouter_api_key");
  }
  return openRouterApiKey;
};

export const generateChatCompletion = async (
  messages: Message[],
  model: string = MODEL,
  temperature: number = 0.85,
  max_tokens: number = 200,
): Promise<string> => {
  const apiKey = getOpenRouterApiKey();
  
  if (!apiKey) {
    throw new Error("OpenRouter API key not set. Please set your API key.");
  }

  // Format messages for the API
  let formattedMessages = [];
  
  // Always include system messages first
  const systemMessages = messages.filter(msg => msg.role === "system");
  formattedMessages.push(...systemMessages.map(({ role, content }) => ({ role, content })));
  
  // Get conversation history (excluding system messages)
  const conversationMessages = messages.filter(msg => msg.role !== "system");
  
  // Add a simple continuity reminder that's less restrictive
  if (conversationMessages.length > 0) {
    const lastAssistantMessages = conversationMessages
      .filter(msg => msg.role === "assistant")
      .slice(-2);
    
    if (lastAssistantMessages.length > 0) {
      let continuityPrompt = "Remember the physical positioning and emotional state from your previous messages. ";
      
      const physicalActionMatches = lastAssistantMessages.map(msg => {
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
  }
  
  // Keep all conversation messages for better context
  const recentMessages = conversationMessages.slice(-50);  // Use a higher limit for max context
  formattedMessages.push(...recentMessages.map(({ role, content }) => ({ role, content })));

  const requestData: ChatCompletionRequest = {
    messages: formattedMessages,
    model,
    temperature,
    max_tokens,
    top_p: 0.95,
    frequency_penalty: 0.40,
    presence_penalty: 0.40,
    repetition_penalty: 1.15,
  };

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.href,
        "X-Title": "Joe Fisher Character Chat"
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to generate chat completion");
    }

    const data: ChatCompletionResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating chat completion:", error);
    throw error;
  }
};
