/**
 * Admin utilities for managing user roles
 * These functions help convert regular users to admin users
 */

import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

/**
 * Get all user profiles from the database
 */
export const getAllUserProfiles = async (): Promise<UserProfile[]> => {
  try {
    console.log('[adminUtils] Fetching all user profiles...');
    
    // Get profiles data with RLS bypass attempt
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role, updated_at')
      .order('updated_at', { ascending: false });

    console.log('[adminUtils] Profiles query result:', { profilesData, profilesError });

    if (profilesError) {
      console.error('[adminUtils] Profiles error:', profilesError);
      
      // If RLS is blocking, try a simpler approach
      if (profilesError.message.includes('permission') || profilesError.message.includes('policy')) {
        console.log('[adminUtils] RLS blocking access, trying alternative approach...');
        
        // Get current user's profile as fallback
        const { data: currentUser } = await supabase.auth.getUser();
        if (currentUser.user) {
          const fallbackProfile = {
            id: currentUser.user.id,
            email: currentUser.user.email || 'Unknown',
            role: 'user' as 'user' | 'admin',
            created_at: currentUser.user.created_at,
            updated_at: currentUser.user.updated_at
          };
          console.log('[adminUtils] Using fallback profile:', fallbackProfile);
          return [fallbackProfile];
        }
      }
      
      throw profilesError;
    }

    if (!profilesData || profilesData.length === 0) {
      console.log('[adminUtils] No profiles found');
      return [];
    }

    console.log('[adminUtils] Successfully fetched profiles:', profilesData);
    
    // Transform data to match interface
    const profiles = profilesData.map(profile => ({
      id: profile.id,
      email: profile.full_name || `User ${profile.id.slice(0, 8)}`,
      role: profile.role as 'user' | 'admin',
      created_at: profile.updated_at || new Date().toISOString(),
      updated_at: profile.updated_at || new Date().toISOString()
    }));
    
    console.log('[adminUtils] Successfully transformed profiles:', profiles);
    return profiles;
  } catch (error) {
    console.error('[adminUtils] Error fetching user profiles:', error);
    throw error;
  }
};

/**
 * Update user role to admin
 */
export const makeUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error making user admin:', error);
    throw error;
  }
};

/**
 * Update user role to regular user
 */
export const makeUserRegular = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'user' })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error making user regular:', error);
    throw error;
  }
};

/**
 * Get current user's profile
 */
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching current user profile:', error);
    throw error;
  }
};

/**
 * Check if current user is admin
 */
export const isCurrentUserAdmin = async (): Promise<boolean> => {
  try {
    const profile = await getCurrentUserProfile();
    return profile?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Create a new profile for a user (usually called after signup)
 */
export const createUserProfile = async (userId: string, email: string, role: 'user' | 'admin' = 'user'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        role: role
      });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export default {
  getAllUserProfiles,
  makeUserAdmin,
  makeUserRegular,
  getCurrentUserProfile,
  isCurrentUserAdmin,
  createUserProfile
};
