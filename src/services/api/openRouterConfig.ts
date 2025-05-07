
// Default model and settings
export const DEFAULT_MODEL = "qwen/qwen-plus";

// API request configuration defaults
export const DEFAULT_TEMPERATURE = 0.90;
export const DEFAULT_MAX_TOKENS = 900;
export const DEFAULT_TOP_P = 0.95;
export const DEFAULT_FREQUENCY_PENALTY = 0.40;
export const DEFAULT_PRESENCE_PENALTY = 0.40;
export const DEFAULT_REPETITION_PENALTY = 1.15;

// API key management
let openRouterApiKey: string | null = "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";

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
