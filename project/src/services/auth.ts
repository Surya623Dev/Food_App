import { supabase } from '../lib/supabase';
import { UserRole } from '../types/auth';

export async function loginUser(email: string, password: string, role: UserRole) {
  // Sign in user
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('No user data returned');

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single();

  if (profileError) throw profileError;
  if (!profile) throw new Error('No profile found');

  // Verify role matches
  if (profile.role !== role) {
    throw new Error(`Invalid credentials for ${role} role`);
  }

  return {
    user: authData.user,
    role: profile.role
  };
}