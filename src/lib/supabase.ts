import { createClient } from '@supabase/supabase-js';

// Supabase project details
const supabaseUrl = 'https://apzazfengfojohyqyldq.supabase.co';
// Replace this with your actual anon/public key from the Supabase dashboard
const supabaseAnonKey = 'your-anon-key'; // You need to replace this with your actual public/anon key

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
