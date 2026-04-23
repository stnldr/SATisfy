import { supabase } from '@/integrations/supabase/client';

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .rpc('is_current_user_admin');

  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }

  return data === true;
}

/**
 * Check if a specific user is an admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('is_admin', { user_id: userId });

  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }

  return data === true;
}

/**
 * Get all admin users (only accessible by admins)
 */
export async function getAdminUsers() {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin users:', error);
    throw error;
  }

  return data;
}

/**
 * Add a user as admin (only accessible by admins)
 */
export async function addAdmin(userId: string, email: string) {
  const { data, error } = await supabase
    .from('admin_users')
    .insert({
      user_id: userId,
      email: email,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding admin:', error);
    throw error;
  }

  return data;
}

/**
 * Remove admin status from a user (only accessible by admins)
 */
export async function removeAdmin(userId: string) {
  const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error removing admin:', error);
    throw error;
  }
}





