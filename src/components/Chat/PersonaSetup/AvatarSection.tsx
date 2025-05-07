
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Camera } from "lucide-react";
import { toast } from "sonner";

interface AvatarSectionProps {
  avatar: string | undefined;
  setAvatar: (avatar: string | undefined) => void;
  name: string;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
}

export function AvatarSection({
  avatar,
  setAvatar,
  name,
  isUploading,
  setIsUploading
}: AvatarSectionProps) {
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

  return (
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
  );
}
