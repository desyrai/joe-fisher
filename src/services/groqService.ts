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
let groqApiKey: string | null = null; 
const TEMP_MODEL = "llama3-8b-8192";

export const setGroqApiKey = (key: string) => {
  groqApiKey = key;
  localStorage.setItem("groq_api_key", key);
};

export const getGroqApiKey = (): string | null => {
  if (!groqApiKey) {
    groqApiKey = localStorage.getItem("groq_api_key");
  }
  return groqApiKey;
};

export const generateChatCompletion = async (
  messages: Message[],
  model: string = TEMP_MODEL,
  temperature: number = 0.7,
  max_tokens: number = 100,
): Promise<string> => {
  const apiKey = getGroqApiKey();
  
  if (!apiKey) {
    throw new Error("Groq API key not set. Please set your API key.");
  }

  // Format messages for the API
  let formattedMessages = [];
  
  // Always include system messages first
  const systemMessages = messages.filter(msg => msg.role === "system");
  formattedMessages.push(...systemMessages.map(({ role, content }) => ({ role, content })));
  
  // Get conversation history (excluding system messages)
  const conversationMessages = messages.filter(msg => msg.role !== "system");
  
  // Add a special system message reminding about continuity with the previous messages
  if (conversationMessages.length > 0) {
    // Find the last two assistant messages for continuity context
    const lastAssistantMessages = conversationMessages
      .filter(msg => msg.role === "assistant")
      .slice(-2);
    
    if (lastAssistantMessages.length > 0) {
      let continuityPrompt = "IMPORTANT: Maintain continuity with your previous actions. ";
      
      lastAssistantMessages.forEach(msg => {
        // Extract physical actions from the previous messages using regex
        const physicalActionMatches = msg.content.match(/\*(.*?)\*/g);
        if (physicalActionMatches && physicalActionMatches.length > 0) {
          continuityPrompt += "In your previous messages you were physically: " + 
            physicalActionMatches.join(" then ") + ". ";
        }
      });
      
      continuityPrompt += "Make sure your next actions flow naturally from this physical position.";
      
      formattedMessages.push({
        role: "system",
        content: continuityPrompt
      });
    }
  }
  
  // Keep all conversation messages for better context, up to a reasonable limit
  const recentMessages = conversationMessages.slice(-8); // Increased from 6 to 8 for better context
  formattedMessages.push(...recentMessages.map(({ role, content }) => ({ role, content })));

  const requestData: ChatCompletionRequest = {
    messages: formattedMessages,
    model,
    temperature,
    max_tokens,
    top_p: 0.9,
    frequency_penalty: 0.3,
    presence_penalty: 0.5,
  };

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
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
