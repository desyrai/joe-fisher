
import { Message } from "@/components/Chat/types";
import { 
  DEFAULT_MODEL,
  DEFAULT_TEMPERATURE,
  DEFAULT_MAX_TOKENS,
  DEFAULT_TOP_P,
  DEFAULT_FREQUENCY_PENALTY,
  DEFAULT_PRESENCE_PENALTY,
  DEFAULT_REPETITION_PENALTY,
  getOpenRouterApiKey,
  setOpenRouterApiKey
} from "./api/openRouterConfig";
import { ChatCompletionRequest, ChatCompletionResponse } from "./api/openRouterTypes";
import { formatMessagesForApi } from "./api/messageFormatter";

// Re-export API key management functions
export { getOpenRouterApiKey, setOpenRouterApiKey };

export const generateChatCompletion = async (
  messages: Message[],
  model: string = DEFAULT_MODEL,
  temperature: number = DEFAULT_TEMPERATURE,
  max_tokens: number = DEFAULT_MAX_TOKENS,
): Promise<string> => {
  const apiKey = getOpenRouterApiKey();
  
  if (!apiKey) {
    throw new Error("OpenRouter API key not set. Please set your API key.");
  }

  // Format messages for the API
  const formattedMessages = formatMessagesForApi(messages);

  const requestData: ChatCompletionRequest = {
    messages: formattedMessages,
    model,
    temperature,
    max_tokens,
    top_p: DEFAULT_TOP_P,
    frequency_penalty: DEFAULT_FREQUENCY_PENALTY,
    presence_penalty: DEFAULT_PRESENCE_PENALTY,
    repetition_penalty: DEFAULT_REPETITION_PENALTY,
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
