import { createClient } from '../client'
import type { Database } from '../types'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export const profileService = {
  async create(data: ProfileInsert) {
    const { data: profile, error } = await createClient()
      .from('profiles')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return profile
  },

  async getById(id: string) {
    const { data: profile, error } = await createClient()
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return profile
  },

  async getByEmail(email: string) {
    const { data: profile, error } = await createClient()
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (error) throw error
    return profile
  },

  async update(id: string, data: ProfileUpdate) {
    const { data: profile, error } = await createClient()
      .from('profiles')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return profile
  },

  async delete(id: string) {
    const { error } = await createClient()
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getByCompanyId(companyId: string) {
    const { data: profiles, error } = await createClient()
      .from('profiles')
      .select('*')
      .eq('company_id', companyId)

    if (error) throw error
    return profiles
  },

  async subscribeToChanges(profileId: string, callback: (payload: any) => void) {
    const subscription = createClient()
      .channel(`profile_${profileId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${profileId}`,
        },
        callback
      )
      .subscribe()

    return () => subscription.unsubscribe()
  },
} 