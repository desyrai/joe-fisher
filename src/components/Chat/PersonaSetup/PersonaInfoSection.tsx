
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PersonaInfoSectionProps {
  name: string;
  setName: (name: string) => void;
  bio: string;
  setBio: (bio: string) => void;
}

export function PersonaInfoSection({
  name,
  setName,
  bio,
  setBio
}: PersonaInfoSectionProps) {
  return (
    <>
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
      
      {/* Bio Input */}
      <div className="space-y-2">
        <Label htmlFor="bio">About You</Label>
        <Textarea 
          id="bio"
          value={bio} 
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell Joe about yourself - your relationship, history, or anything he should know..." 
          className="min-h-[100px] border-desyr-soft-gold/30"
        />
      </div>
    </>
  );
}
