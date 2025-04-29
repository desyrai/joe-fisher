
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Italic } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e?: React.FormEvent) => Promise<void>;
  onContinue: () => void;
  onRegenerate: () => void;
  hasMessages: boolean;
}

const ChatInput = ({
  input,
  setInput,
  isLoading,
  onSubmit,
  onContinue,
  hasMessages
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleContinue = () => {
    onContinue();
  };

  const insertItalics = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = input.substring(start, end);
      const newText = 
        input.substring(0, start) + 
        `*${selectedText}*` + 
        input.substring(end);
      
      setInput(newText);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          // Position cursor between the asterisks when no text is selected
          const newPosition = start + (selectedText.length > 0 ? selectedText.length + 2 : 1);
          textareaRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
  };

  return (
    <div className="border-t border-desyr-soft-gold/20 p-4">
      <form onSubmit={onSubmit} className="space-y-2">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (use ((your instructions)) for private directions to Joe)"
            className="min-h-[100px] pr-10 resize-none border-desyr-soft-gold/30"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-desyr-deep-gold hover:text-desyr-soft-gold hover:bg-transparent"
            onClick={insertItalics}
          >
            <Italic className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleContinue}
            disabled={isLoading}
            className="border-desyr-soft-gold/30 hover:bg-desyr-soft-gold/10 hover:text-desyr-deep-gold"
          >
            Continue
          </Button>
          
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            className="gold-button"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
