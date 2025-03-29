
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Github, Linkedin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
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
      
      if (isSignUp) {
        // Sign up new user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              points: 0 // Initialize user with 0 points
            },
            redirectTo: `${window.location.origin}/auth/callback`
          }
        });

        if (error) throw error;
        
        toast({
          title: "Sign Up Successful",
          description: "Please check your email for verification link",
        });
      } else {
        // Sign in existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        
        // Store email in localStorage for backward compatibility
        localStorage.setItem('userEmail', email);
        
        toast({
          title: "Login Successful",
          description: "Welcome to Shadow Task Manager!",
        });
        
        // Redirect to main page
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to authenticate",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'linkedin') => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || `Failed to authenticate with ${provider}`,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-solo-dark flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
            Shadow Task Manager
          </h1>
          <p className="text-solo-gray">
            {isSignUp ? 'Create an account to track your tasks' : 'Sign in to track your tasks and level up your productivity'}
          </p>
        </div>
        
        <div className="glassmorphism p-8 animate-fade-in">
          <form onSubmit={handleEmailAuth} className="space-y-6">
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
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-solo-gray" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10 bg-black/20 border-solo-purple/20 focus:border-solo-purple text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-purple hover:opacity-90 transition-opacity" 
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-solo-purple hover:underline"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-solo-gray/20" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-black px-2 text-solo-gray">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full bg-black/20 border-solo-purple/20 hover:bg-solo-purple/20 text-white"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full bg-black/20 border-solo-purple/20 hover:bg-solo-purple/20 text-white"
                onClick={() => handleSocialLogin('linkedin')}
                disabled={isLoading}
              >
                <Linkedin className="h-5 w-5 mr-2 text-[#0A66C2]" />
                LinkedIn
              </Button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-solo-gray">
              By signing in, you'll be able to save your tasks and rank progress across sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
