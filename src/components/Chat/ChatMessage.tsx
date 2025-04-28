
import { RefreshCw, Bookmark, Edit, SkipForward, Check, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Message } from "./types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
  onRemember: () => void;
  onEdit: (newContent: string) => void;
  onRegenerate?: () => void;
  characterAvatar?: string;
}

const ChatMessage = ({ message, onRemember, onEdit, onRegenerate, characterAvatar }: ChatMessageProps) => {
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

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate();
    }
  };
  
  // Show previous versions dropdown only if there are actual regenerations
  const hasRegenerations = message.regenerations && message.regenerations.length > 0;
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} max-w-[80%]`}>
        {!isUser && (
          <div className="mr-2 mt-1">
            <Avatar className="h-8 w-8 border border-desyr-soft-gold/30">
              <AvatarImage src={characterAvatar} alt="Character" />
              <AvatarFallback className="bg-desyr-deep-gold text-white">AI</AvatarFallback>
            </Avatar>
          </div>
        )}
        
        <div className="flex flex-col">
          <div className={isUser ? "chat-bubble-user" : "chat-bubble-ai"}>
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[100px] border-desyr-soft-gold/30"
                  autoFocus
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    className="text-desyr-taupe"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSaveEdit}
                    className="gold-button"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <ReactMarkdown 
                className="prose prose-sm max-w-none"
                components={{
                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                  em: ({node, ...props}) => <em className="text-desyr-deep-gold font-normal not-italic" {...props} />
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
          
          {hasRegenerations && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs px-2 py-0 h-6 text-desyr-taupe flex items-center mt-1"
                >
                  {message.regenerations!.length} previous version{message.regenerations!.length !== 1 ? 's' : ''}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {message.regenerations!.map((content, index) => (
                  <DropdownMenuItem 
                    key={index}
                    className="cursor-pointer"
                    onClick={() => handleSelectPreviousVersion(content)}
                  >
                    {content.length > 30 ? `${content.substring(0, 30)}...` : content}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <div className={`flex mt-1 ${isUser ? "justify-end" : "justify-start"}`}>
            <div className="flex space-x-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={onRemember}
                className={`text-xs px-2 py-0 h-6 ${
                  message.remembered ? "text-desyr-deep-gold" : "text-desyr-taupe"
                }`}
              >
                <Bookmark className={`h-3 w-3 mr-1 ${message.remembered ? "fill-desyr-deep-gold" : ""}`} />
                {message.remembered ? "Remembered" : "Remember"}
              </Button>

              {!isUser && onRegenerate && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleRegenerate}
                  className="text-xs px-2 py-0 h-6 text-desyr-taupe hover:text-desyr-deep-gold hover:bg-desyr-soft-gold/10"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Regenerate
                </Button>
              )}
              
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="text-xs px-2 py-0 h-6 text-desyr-taupe"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
