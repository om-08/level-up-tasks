
import { createClient } from '@supabase/supabase-js';

// Supabase project details
const supabaseUrl = 'https://apzazfengfojohyqyldq.supabase.co';
// Using the actual anon/public key from the Supabase dashboard
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwemF6ZmVuZ2Zvam9oeXF5bGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1OTEzODUsImV4cCI6MjA1ODE2NzM4NX0.iLEVI2Fsjd2eFhXT0iZplHdHkc48A82m1q_CF7QkU0Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getUserProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  
  // Get user profile data from the profiles table
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};

export const updateUserPoints = async (points: number) => {
  const user = await getCurrentUser();
  if (!user) return;
  
  // Update the user's points in the profiles table
  const { error } = await supabase
    .from('profiles')
    .update({ points })
    .eq('id', user.id);
    
  if (error) {
    console.error('Error updating user points:', error);
  }
};

// Listen for auth state changes
export const setupAuthListener = (callback: (session: any) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session);
    }
  );
  
  return subscription;
};
