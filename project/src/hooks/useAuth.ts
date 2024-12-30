import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthUser } from '../types/auth';

interface AuthStore {
  user: AuthUser | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setUser: (user: AuthUser | null) => void;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  setLoading: (loading) => set({ loading }),
  setUser: (user) => set({ user }),
  
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email!,
              role: profile.role
            }
          });
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (!user) throw new Error('Login failed');

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile) throw new Error('Profile not found');

    const authUser = {
      id: user.id,
      email: user.email!,
      role: profile.role
    };

    set({ user: authUser });
    return authUser;
  },

  signup: async (email, password) => {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!user) throw new Error('Signup failed');

    // Profile will be created automatically via database trigger
    set({
      user: {
        id: user.id,
        email: user.email!,
        role: 'customer' // New users are always customers
      }
    });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  }
}));