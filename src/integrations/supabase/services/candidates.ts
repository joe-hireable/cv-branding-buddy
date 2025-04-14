import { supabase } from '../supabaseClient'
import type { Database } from '../types'

type Candidate = Database['public']['Tables']['candidates']['Row']
type CandidateInsert = Database['public']['Tables']['candidates']['Insert']
type CandidateUpdate = Database['public']['Tables']['candidates']['Update']

export const candidateService = {
  async create(data: CandidateInsert) {
    const { data: candidate, error } = await supabase
      .from('candidates')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return candidate
  },

  async getById(id: string) {
    const { data: candidate, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return candidate
  },

  async listByOwner(ownerId: string) {
    const { data: candidates, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return candidates
  },

  async update(id: string, data: CandidateUpdate) {
    const { data: candidate, error } = await supabase
      .from('candidates')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return candidate
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async subscribeToChanges(ownerId: string, callback: (payload: any) => void) {
    const subscription = supabase
      .channel('candidates_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'candidates',
          filter: `owner_id=eq.${ownerId}`,
        },
        callback
      )
      .subscribe()

    return () => subscription.unsubscribe()
  },
} 