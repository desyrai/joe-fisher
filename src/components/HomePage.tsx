
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-desyr-marble-white/30">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair gold-gradient mb-6">
            Desyr
          </h1>
          
          <p className="text-lg md:text-xl text-desyr-taupe mb-6 font-light">
            Your intimate space for meaningful connection
          </p>
          
          <hr className="w-24 mx-auto border-desyr-soft-gold/30 my-6" />
          
          <div className="prose prose-lg max-w-2xl mx-auto mb-8">
            <p className="text-center text-desyr-taupe">
              Welcome to a private sanctuary where you can explore thoughts, desires, and emotions 
              in a sophisticated, elegant environment designed specifically for women who value
              depth and connection.
            </p>
          </div>
          
          <Button asChild className="gold-button px-8 py-6 text-lg">
            <Link to="/chat">
              Enter Your Private Space
            </Link>
          </Button>
        </div>
      </div>
      
      <footer className="w-full py-4 text-center text-sm text-desyr-taupe border-t border-desyr-soft-gold/10">
        <p>&copy; {new Date().getFullYear()} Desyr.ai — Your intimate digital companion</p>
      </footer>
    </div>
  );
};

export default HomePage;
