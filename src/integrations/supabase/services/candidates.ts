import { supabase } from '../client'
import { handleError } from '../utils/error-handler'

export interface Candidate {
  id: string
  first_name: string | null
  last_name: string | null
  current_position: string | null
  current_company: string | null
  owner_id: string
  created_at: string
  updated_at: string
}

export interface CreateCandidateData {
  first_name?: string | null
  last_name?: string | null
  current_position?: string | null
  current_company?: string | null
  owner_id: string
}

export const candidateService = {
  async create(data: CreateCandidateData): Promise<Candidate> {
    try {
      const { data: candidate, error } = await supabase
        .from('candidates')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return candidate
    } catch (error) {
      throw handleError(error)
    }
  },

  async getById(id: string): Promise<Candidate | null> {
    try {
      const { data: candidate, error } = await supabase
        .from('candidates')
        .select()
        .eq('id', id)
        .single()

      if (error) throw error
      return candidate
    } catch (error) {
      throw handleError(error)
    }
  },

  async getByOwnerId(ownerId: string): Promise<Candidate[]> {
    try {
      const { data: candidates, error } = await supabase
        .from('candidates')
        .select()
        .eq('owner_id', ownerId)

      if (error) throw error
      return candidates || []
    } catch (error) {
      throw handleError(error)
    }
  },

  async update(id: string, data: Partial<CreateCandidateData>): Promise<Candidate> {
    try {
      const { data: candidate, error } = await supabase
        .from('candidates')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return candidate
    } catch (error) {
      throw handleError(error)
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      throw handleError(error)
    }
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