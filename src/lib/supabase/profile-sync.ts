import { getSupabaseAdminClient } from './server'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

export interface ProfileData {
  clerkId: string
  email: string
  fullName?: string | null
  avatarUrl?: string | null
}

/**
 * Ensures a profile exists for the given Clerk user.
 * Creates one if it doesn't exist, returns existing one if it does.
 *
 * Uses the admin client to bypass RLS since the profile doesn't exist yet
 * when we're creating it.
 */
export async function ensureProfile(data: ProfileData): Promise<Profile> {
  const supabase = getSupabaseAdminClient()

  // Check if profile already exists
  const { data: existingProfile, error: selectError } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_id', data.clerkId)
    .single()

  if (existingProfile) {
    // Update profile if email or name changed
    if (
      existingProfile.email !== data.email ||
      existingProfile.full_name !== data.fullName ||
      existingProfile.avatar_url !== data.avatarUrl
    ) {
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          email: data.email,
          full_name: data.fullName ?? null,
          avatar_url: data.avatarUrl ?? null,
        })
        .eq('clerk_id', data.clerkId)
        .select()
        .single()

      if (updateError) {
        console.error('Failed to update profile:', updateError)
        return existingProfile
      }

      return updatedProfile
    }

    return existingProfile
  }

  // Profile doesn't exist (selectError is "no rows"), create it
  if (selectError && selectError.code !== 'PGRST116') {
    // PGRST116 = no rows returned, which is expected for new users
    console.error('Error checking for existing profile:', selectError)
    throw new Error('Failed to check for existing profile')
  }

  const { data: newProfile, error: insertError } = await supabase
    .from('profiles')
    .insert({
      clerk_id: data.clerkId,
      email: data.email,
      full_name: data.fullName ?? null,
      avatar_url: data.avatarUrl ?? null,
    })
    .select()
    .single()

  if (insertError) {
    console.error('Failed to create profile:', insertError)
    throw new Error('Failed to create profile')
  }

  return newProfile
}

/**
 * Get the internal profile ID for a Clerk user.
 * Returns null if profile doesn't exist.
 */
export async function getProfileId(clerkId: string): Promise<string | null> {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_id', clerkId)
    .single()

  if (error || !data) {
    return null
  }

  return data.id
}
