import { supabase } from '../client'
import type { Database } from '../types'

type Company = Database['public']['Tables']['companies']['Row']
type CompanyInsert = Database['public']['Tables']['companies']['Insert']
type CompanyUpdate = Database['public']['Tables']['companies']['Update']

export const companyService = {
  async create(data: CompanyInsert) {
    const { data: company, error } = await supabase
      .from('companies')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return company
  },

  async getById(id: string) {
    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return company
  },

  async update(id: string, data: CompanyUpdate) {
    const { data: company, error } = await supabase
      .from('companies')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return company
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async subscribeToChanges(companyId: string, callback: (payload: any) => void) {
    const subscription = supabase
      .channel('companies_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'companies',
          filter: `id=eq.${companyId}`,
        },
        callback
      )
      .subscribe()

    return () => subscription.unsubscribe()
  },
} 