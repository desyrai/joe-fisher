
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Upload, Camera } from "lucide-react";
import { toast } from "sonner";
import { UserInfo } from "./types";

interface PersonaSetupProps {
  userInfo: UserInfo;
  onSave: (userInfo: UserInfo) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const PersonaSetup = ({ userInfo, onSave, onCancel, isEditing = false }: PersonaSetupProps) => {
  const [name, setName] = useState(userInfo.name === "You" ? "" : userInfo.name);
  const [avatar, setAvatar] = useState<string | undefined>(userInfo.avatar);
  const [bio, setBio] = useState(userInfo.bio || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isExternalUrl, setIsExternalUrl] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if the current avatar is an external URL
  useEffect(() => {
    if (avatar && (avatar.startsWith("http://") || avatar.startsWith("https://"))) {
      setIsExternalUrl(true);
      setExternalUrl(avatar);
    } else {
      setIsExternalUrl(false);
    }
  }, [avatar]);

  // Handle file selection 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    setIsUploading(true);
    setIsExternalUrl(false);
    
    // Convert image to base64 for storage and display
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string);
        setIsUploading(false);
        console.log("Avatar set from file:", (event.target.result as string).substring(0, 50) + "...");
      }
    };
    reader.onerror = () => {
      toast.error("Error processing image");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle external URL input
  const handleExternalUrlSubmit = () => {
    if (!externalUrl) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    setIsUploading(true);
    
    // Test if URL is valid by loading an image
    const img = new Image();
    img.onload = () => {
      setAvatar(externalUrl);
      setIsUploading(false);
      toast.success("Image loaded successfully");
      console.log("Avatar set from external URL:", externalUrl);
    };
    img.onerror = () => {
      toast.error("Could not load image from URL");
      setIsUploading(false);
    };
    img.src = externalUrl;
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Use mobile camera if available
  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.capture = 'user';
      fileInputRef.current.click();
    }
  };

  const handleSave = () => {
    // Log the avatar value being saved for debugging
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
          {/* Avatar Preview & Upload */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 border-2 border-desyr-soft-gold/30">
              {avatar ? (
                <AvatarImage 
                  src={avatar} 
                  alt={name} 
                  className="object-cover"
                  onError={(e) => {
                    console.error("Error loading avatar in setup:", avatar);
                    toast.error("Error loading image");
                    // If image fails to load, clear it
                    setAvatar(undefined);
                  }}
                />
              ) : (
                <AvatarFallback className="bg-desyr-taupe text-white text-xl">
                  {name ? name.charAt(0).toUpperCase() : "Y"}
                </AvatarFallback>
              )}
            </Avatar>
            
            {/* Hidden file input */}
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {/* External URL input */}
            <div className="w-full space-y-2">
              <Label htmlFor="externalUrl">Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="externalUrl"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 border-desyr-soft-gold/30"
                />
                <Button 
                  onClick={handleExternalUrlSubmit}
                  variant="outline"
                  className="border-desyr-soft-gold/30 hover:bg-desyr-soft-gold/10"
                  disabled={isUploading || !externalUrl}
                >
                  Set
                </Button>
              </div>
            </div>
            
            {/* Upload buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleUploadClick}
                variant="outline" 
                className="border-desyr-soft-gold/30 hover:bg-desyr-soft-gold/10"
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              <Button
                onClick={handleCameraCapture}
                variant="outline"
                className="border-desyr-soft-gold/30 hover:bg-desyr-soft-gold/10"
                disabled={isUploading}
              >
                <Camera className="h-4 w-4 mr-2" />
                Camera
              </Button>
            </div>
            {isUploading && <p className="text-sm text-desyr-taupe">Uploading image...</p>}
            
            {/* Test image with example URL */}
            <Button
              onClick={() => {
                setExternalUrl("https://i.imgur.com/Zz4FEXf.jpg");
                setTimeout(() => handleExternalUrlSubmit(), 100);
              }}
              variant="outline"
              className="border-desyr-soft-gold/30 hover:bg-desyr-soft-gold/10"
              disabled={isUploading}
            >
              Test with Example Image
            </Button>
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
};

export default PersonaSetup;
