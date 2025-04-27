
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SignupFormProps {
  onSignup: (email: string) => void;
}

const SignupForm = ({ onSignup }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, you would send this to a backend
    // For now, we'll just simulate a signup
    setTimeout(() => {
      localStorage.setItem("desyr_email", email);
      setIsSubmitting(false);
      onSignup(email);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <h2 className="text-2xl font-playfair gold-gradient mb-2">Join Desyr</h2>
      <p className="text-desyr-taupe mb-6">
        Enter your email to get started with your intimate conversations
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="py-6 border-desyr-soft-gold/30 focus:border-desyr-deep-gold"
            required
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        
        <Button 
          type="submit" 
          className="w-full gold-button py-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Continue"}
        </Button>
        
        <p className="text-xs text-center text-desyr-taupe mt-4">
          By signing up, you agree to our Terms of Service and Privacy Policy. 
          Your data remains private and secure.
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
