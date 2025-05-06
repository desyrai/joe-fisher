
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";

interface PersonaSetupProps {
  userInfo: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  onSave: (userInfo: { name: string; avatar?: string; bio?: string }) => void;
  onCancel: () => void;
}

const PersonaSetup = ({ userInfo, onSave, onCancel }: PersonaSetupProps) => {
  const [name, setName] = useState(userInfo.name === "You" ? "" : userInfo.name);
  const [avatar, setAvatar] = useState(userInfo.avatar || "");
  const [bio, setBio] = useState(userInfo.bio || "");

  // Handle avatar upload (URL input in this version)
  const handleAvatarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar(e.target.value);
  };

  const handleSave = () => {
    onSave({
      name: name || "You",
      avatar,
      bio,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-desyr-soft-gold/20">
        <CardHeader className="border-b border-desyr-soft-gold/20">
          <CardTitle className="text-center font-playfair text-desyr-deep-gold">Your Persona</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 border-2 border-desyr-soft-gold/30">
              <AvatarImage src={avatar} alt={name} className="object-cover" />
              <AvatarFallback className="bg-desyr-taupe text-white text-xl">
                {name ? name.charAt(0).toUpperCase() : "Y"}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input 
              id="name"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name" 
              className="border-desyr-soft-gold/30"
            />
          </div>
          
          {/* Avatar URL Input */}
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input 
              id="avatar"
              value={avatar} 
              onChange={handleAvatarUrlChange}
              placeholder="https://example.com/your-avatar.jpg" 
              className="border-desyr-soft-gold/30"
            />
            <p className="text-xs text-desyr-taupe">Enter a direct URL to an image</p>
          </div>
          
          {/* Bio Input */}
          <div className="space-y-2">
            <Label htmlFor="bio">About You (Optional)</Label>
            <Textarea 
              id="bio"
              value={bio} 
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell Joe Fisher a bit about yourself..." 
              className="min-h-[100px] border-desyr-soft-gold/30"
            />
          </div>
        </CardContent>
        
        <CardFooter className="border-t border-desyr-soft-gold/20 pt-4 flex justify-between">
          <Button variant="ghost" onClick={onCancel} className="text-desyr-taupe">
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="gold-button">
            <Check className="h-4 w-4 mr-1" />
            Save Persona
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PersonaSetup;
