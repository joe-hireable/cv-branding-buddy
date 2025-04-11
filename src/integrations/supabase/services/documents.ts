import { createClient } from '../client'
import type { Database } from '../types'

type GeneratedDocument = Database['public']['Tables']['generated_documents']['Row']
type GeneratedDocumentInsert = Database['public']['Tables']['generated_documents']['Insert']

export const documentService = {
  async create(data: GeneratedDocumentInsert) {
    const { data: document, error } = await createClient()
      .from('generated_documents')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return document
  },

  async getByCVId(cvId: string) {
    const { data: documents, error } = await createClient()
      .from('generated_documents')
      .select('*')
      .eq('cv_id', cvId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return documents
  },

  async getById(id: string) {
    const { data: document, error } = await createClient()
      .from('generated_documents')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return document
  },

  async subscribeToDocuments(cvId: string, callback: (payload: any) => void) {
    const subscription = createClient()
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