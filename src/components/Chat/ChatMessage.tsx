
import { useState } from "react";
import { Message } from "./types";
import { Card } from "@/components/ui/card";
import MessageAvatar from "./MessageAvatar";
import MessageContent from "./MessageContent";
import MessageControls from "./MessageControls";
import EditMessage from "./EditMessage";

interface ChatMessageProps {
  message: Message;
  onRemember: () => void;
  onEdit: (newContent: string) => void;
  onRegenerate?: () => void;
  characterAvatar?: string;
  userInfo?: {
    name: string;
    avatar?: string;
  };
}

const ChatMessage = ({ 
  message, 
  onRemember, 
  onEdit, 
  onRegenerate, 
  characterAvatar,
  userInfo = { name: "You" } 
}: ChatMessageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  
  const isUser = message.role === "user";
  
  const handleSaveEdit = () => {
    onEdit(editContent);
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleSelectPreviousVersion = (content: string) => {
    onEdit(content);
  };

  return (
    <div className="mb-10">
      <Card className="border border-desyr-soft-gold/20 shadow-sm">
        <div className="flex flex-col md:flex-row">
          {/* Left Column - Character Avatar */}
          <MessageAvatar 
            isUser={isUser}
            avatar={isUser ? (userInfo.avatar || "/placeholder.svg") : characterAvatar}
            name={userInfo.name}
          />

          {/* Right Column - Message Content */}
          <div className="flex-1 p-8 flex flex-col">
            {isEditing ? (
              <EditMessage 
                content={editContent}
                onChange={setEditContent}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            ) : (
              <MessageContent content={message.content} />
            )}

            {/* Message Controls */}
            <MessageControls 
              isUser={isUser}
              remembered={!!message.remembered}
              onRemember={onRemember}
              onEdit={() => setIsEditing(true)}
              onRegenerate={!isUser ? onRegenerate : undefined}
              regenerations={message.regenerations}
              onSelectVersion={handleSelectPreviousVersion}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatMessage;
