import { supabase } from '../supabaseClient'
import type { Database } from '../types'

type CV = Database['public']['Tables']['cvs']['Row']
type CVInsert = Database['public']['Tables']['cvs']['Insert']
type CVUpdate = Database['public']['Tables']['cvs']['Update']
type CVStatus = Database['public']['Enums']['cv_status']

export const cvService = {
  async create(data: CVInsert) {
    const { data: cv, error } = await supabase
      .from('cvs')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return cv
  },

  async getById(id: string) {
    const { data: cv, error } = await supabase
      .from('cvs')
      .select(`
        *,
        candidate:candidates(*),
        analysis_results:cv_analysis_results(*),
        chats:cv_chats(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return cv
  },

  async listByCandidate(candidateId: string) {
    const { data: cvs, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return cvs
  },

  async updateStatus(id: string, status: CVStatus) {
    const { data: cv, error } = await supabase
      .from('cvs')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return cv
  },

  async update(id: string, data: CVUpdate) {
    const { data: cv, error } = await supabase
      .from('cvs')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return cv
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('cvs')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async subscribeToStatus(cvId: string, callback: (status: CVStatus) => void) {
    const subscription = supabase
      .channel(`cv_status_${cvId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'cvs',
          filter: `id=eq.${cvId}`,
        },
        (payload) => {
          callback(payload.new.status)
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  },

  async subscribeToAnalysisResults(cvId: string, callback: (payload: any) => void) {
    const subscription = supabase
      .channel(`cv_analysis_${cvId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cv_analysis_results',
          filter: `cv_id=eq.${cvId}`,
        },
        callback
      )
      .subscribe()

    return () => subscription.unsubscribe()
  },
} 