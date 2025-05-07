
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { UserInfo } from "../types";
import { AvatarSection } from "./AvatarSection";
import { PersonaInfoSection } from "./PersonaInfoSection";

interface PersonaSetupModalProps {
  userInfo: UserInfo;
  onSave: (userInfo: UserInfo) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function PersonaSetupModal({ userInfo, onSave, onCancel, isEditing = false }: PersonaSetupModalProps) {
  const [name, setName] = useState(userInfo.name === "You" ? "" : userInfo.name);
  const [avatar, setAvatar] = useState<string | undefined>(userInfo.avatar);
  const [bio, setBio] = useState(userInfo.bio || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = () => {
    console.log("Saving persona with avatar:", avatar?.substring(0, 50) + "...");
    
    onSave({
      id: userInfo.id || "",
      name: name || "You",
      avatar,
      bio,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-desyr-soft-gold/20">
        <CardHeader className="border-b border-desyr-soft-gold/20">
          <CardTitle className="text-center font-playfair text-desyr-deep-gold">
            {isEditing ? 'Edit Persona' : 'Create New Persona'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <AvatarSection 
            avatar={avatar}
            setAvatar={setAvatar}
            name={name}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
          
          <PersonaInfoSection
            name={name}
            setName={setName}
            bio={bio}
            setBio={setBio}
          />
        </CardContent>
        
        <CardFooter className="border-t border-desyr-soft-gold/20 pt-4 flex justify-between">
          <Button variant="ghost" onClick={onCancel} className="text-desyr-taupe">
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="gold-button">
            <Check className="h-4 w-4 mr-1" />
            {isEditing ? 'Update Persona' : 'Save Persona'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
