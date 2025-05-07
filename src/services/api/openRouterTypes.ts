
export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  repetition_penalty?: number;
}

export interface ChatCompletionResponse {
  choices: {
    message: ChatMessage;
  }[];
}
