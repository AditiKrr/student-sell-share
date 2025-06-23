
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
}

const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();

  const validateCollegeEmail = (email: string) => {
    // List of common college domains (you can expand this)
    const collegeDomains = [
      'iitd.ac.in', 'iitb.ac.in', 'iitk.ac.in', 'iitm.ac.in', 'iitr.ac.in',
      'dtu.ac.in', 'nsit.ac.in', 'bits-pilani.ac.in', 'vit.ac.in',
      'manipal.edu', 'srm.ap.edu', 'student.iitd.ac.in'
    ];
    
    const domain = email.split('@')[1];
    return collegeDomains.includes(domain) || domain?.includes('.edu') || domain?.includes('.ac.in');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!validateCollegeEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please use your college email address to sign up",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success!",
      description: `Welcome to Campus Mart! You can now view items from your campus.`,
    });

    onLogin(email);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isSignUp ? "Sign Up for Campus Mart" : "Login to Campus Mart"}
          </DialogTitle>
          <DialogDescription>
            Use your college email address to access your campus marketplace
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">College Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.name@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll identify your campus from your email domain
            </p>
          </div>
          
          <Button type="submit" className="w-full">
            {isSignUp ? "Sign Up" : "Login"}
          </Button>
          
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm"
            >
              {isSignUp 
                ? "Already have an account? Login" 
                : "New to Campus Mart? Sign Up"
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
