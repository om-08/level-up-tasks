
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Store email in localStorage
    localStorage.setItem('userEmail', email);
    
    // Show success message
    toast({
      title: "Login Successful",
      description: "Welcome to Shadow Task Manager!",
    });
    
    // Redirect to main page after a short delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-solo-dark flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
            Shadow Task Manager
          </h1>
          <p className="text-solo-gray">
            Sign in to track your tasks and level up your productivity
          </p>
        </div>
        
        <div className="glassmorphism p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-solo-gray" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 bg-black/20 border-solo-purple/20 focus:border-solo-purple text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-solo-gray">
                We'll only use this to save your progress
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-purple hover:opacity-90 transition-opacity" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-solo-gray">
              By signing in, you'll be able to save your tasks and rank progress across sessions.
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-solo-gray">
          <p>
            Shadow Task Manager helps you build productive habits while gamifying your daily tasks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
