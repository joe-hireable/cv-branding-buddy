import { supabase } from '../client'
import type { Database } from '../types'

type Document = Database['public']['Tables']['documents']['Row']
type DocumentInsert = Database['public']['Tables']['documents']['Insert']
type DocumentUpdate = Database['public']['Tables']['documents']['Update']

type GeneratedDocument = Database['public']['Tables']['generated_documents']['Row']
type GeneratedDocumentInsert = Database['public']['Tables']['generated_documents']['Insert']

export const documentService = {
  async create(data: GeneratedDocumentInsert) {
    const { data: document, error } = await supabase
      .from('generated_documents')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return document
  },

  async getByCVId(cvId: string) {
    const { data: documents, error } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('cv_id', cvId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return documents
  },

  async getById(id: string) {
    const { data: document, error } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return document
  },

  async subscribeToDocuments(cvId: string, callback: (payload: any) => void) {
    const subscription = supabase
      .channel('generated_documents_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'generated_documents',
          filter: `cv_id=eq.${cvId}`,
        },
        callback
      )
      .subscribe()

    return () => subscription.unsubscribe()
  },
} 