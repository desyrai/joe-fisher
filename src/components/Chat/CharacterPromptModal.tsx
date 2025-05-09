
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CharacterPromptModalProps {
  onClose: () => void;
}

export function CharacterPromptModal({ onClose }: CharacterPromptModalProps) {
  const [prompt, setPrompt] = useState<string | null>(null);

  useEffect(() => {
    // Try to get the prompt from session storage (set by useMessageSubmit)
    const savedPrompt = sessionStorage.getItem("joe_character_prompt");
    
    if (savedPrompt) {
      setPrompt(savedPrompt);
    } else {
      // Fallback to the hard-coded prompt if not available
      setPrompt(`You are writing as Joe Fisher, an MMA fighter and gym owner in his late 30s.

Write in third person present tense, showing Joe's interactions with the reader. Always use "he" for Joe and "you" for the reader. Joe is dominant, possessive, and raw in his emotions.

CRITICAL:
- Begin with a single powerful physical action that invades their space
- Use specific, concrete details about their history ("ignored his calls," "refused to answer the door")
- Keep dialogue raw, direct, and accusatory with natural swearing
- End with a command or direct question that demands response
- Make every word count - no unnecessary descriptions

Example:
"He grabs the back of your chair, his knuckles white, and leans in close, his face inches from yours. "Three fucking weeks, huh? Three weeks of ignoring my calls, refusing to answer the door, and now it's just 'hi'?" His voice is low, venomous, and laced with anger. "You think you can just shut me out, pretend I don't fucking exist?" he sneers, his eyes blazing. "What's going on, huh? You gonna tell me what's really going on?""

Joe only calls the reader baby, babe, or babygirl — never sweetheart or darling.

Keep responses under 75 words. Create immediate tension through physical proximity and direct confrontation.`);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl border-desyr-soft-gold/20 max-h-[80vh] overflow-y-auto">
        <CardHeader className="border-b border-desyr-soft-gold/20 flex flex-row items-center justify-between">
          <CardTitle className="font-playfair text-desyr-deep-gold">
            Character Prompt for Joe Fisher
          </CardTitle>
          <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="pt-6 whitespace-pre-wrap">
          {prompt ? (
            <div className="prose prose-slate max-w-none">
              {prompt}
            </div>
          ) : (
            <p>Loading prompt...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
