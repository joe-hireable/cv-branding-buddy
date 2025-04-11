import { createClient } from '../client'
import type { Database } from '../types'

type AnalysisResult = Database['public']['Tables']['cv_analysis_results']['Row']
type AnalysisResultInsert = Database['public']['Tables']['cv_analysis_results']['Insert']
type AnalysisTaskType = Database['public']['Enums']['analysis_task_type']

export const analysisService = {
  async create(data: AnalysisResultInsert) {
    const { data: result, error } = await createClient()
      .from('cv_analysis_results')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return result
  },

  async getByCVId(cvId: string) {
    const { data: results, error } = await createClient()
      .from('cv_analysis_results')
      .select('*')
      .eq('cv_id', cvId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return results
  },

  async getByTaskType(cvId: string, taskType: AnalysisTaskType) {
    const { data: result, error } = await createClient()
      .from('cv_analysis_results')
      .select('*')
      .eq('cv_id', cvId)
      .eq('task_type', taskType)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) throw error
    return result
  },

  async delete(id: string) {
    const { error } = await createClient()
      .from('cv_analysis_results')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async subscribeToResults(cvId: string, callback: (payload: any) => void) {
    const subscription = createClient()
      .channel('analysis_results_changes')
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