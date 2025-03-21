
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const AuthCallback = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      // Process the OAuth callback
      const { data, error } = await supabase.auth.getSession();
      
      if (data.session) {
        // Store email in localStorage for backward compatibility
        const userEmail = data.session.user.email;
        if (userEmail) {
          localStorage.setItem('userEmail', userEmail);
        }
      }
      
      setIsProcessing(false);
    };
    
    handleAuthCallback();
  }, []);
  
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-solo-dark flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-solo-purple rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-medium">Completing authentication...</h2>
        </div>
      </div>
    );
  }
  
  // Redirect to the home page after processing
  return <Navigate to="/" />;
};

export default AuthCallback;
