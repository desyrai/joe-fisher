
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
  temperature: number = 1.4,
  max_tokens: number = 150,
): Promise<string> => {
  const apiKey = getGroqApiKey();
  
  if (!apiKey) {
    throw new Error("Groq API key not set. Please set your API key.");
  }

  const formattedMessages = messages.map(({ role, content }) => ({
    role,
    content,
  }));

  const requestData: ChatCompletionRequest = {
    messages: formattedMessages,
    model,
    temperature,
    max_tokens,
    top_p: 0.9,
    frequency_penalty: 0.3,
    presence_penalty: 0.7,
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

