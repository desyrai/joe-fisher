
import { Message } from "@/components/Chat/types";

/**
 * Creates a new chat while preserving remembered messages and system messages
 */
export const createNewChat = (messages: Message[]): Message[] => {
  // Filter out messages that should be kept (remembered ones and system messages)
  const rememberedMessages = messages.filter(
    (msg) => msg.remembered || msg.role === "system"
  );
  
  // Add the welcome message to start the new chat
  return [
    ...rememberedMessages,
    {
      id: `assistant-welcome-${Date.now()}`,
      role: "assistant",
      content: "*He leans against his desk, arms crossed over his broad chest, jaw tight as he watches you enter the room. His eyes narrow, tracking your movement.* \"Three fucking weeks of nothing, baby. No calls, no texts. *He straightens, taking a deliberate step toward you.* I left you six messages yesterday. Six. What the hell's going on with you?\"",
      timestamp: Date.now(),
    },
  ];
};
