import { createClient } from '../client'
import type { Database } from '../types'

type ChatMessage = Database['public']['Tables']['cv_chats']['Row']
type ChatMessageInsert = Database['public']['Tables']['cv_chats']['Insert']
type ChatSenderType = Database['public']['Enums']['chat_sender_type']

export const chatService = {
  async create(data: ChatMessageInsert) {
    const { data: message, error } = await createClient()
      .from('cv_chats')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return message
  },

  async getByCVId(cvId: string) {
    const { data: messages, error } = await createClient()
      .from('cv_chats')
      .select('*')
      .eq('cv_id', cvId)
      .order('timestamp', { ascending: true })

    if (error) throw error
    return messages
  },

  async getLatestMessages(cvId: string, limit: number = 50) {
    const { data: messages, error } = await createClient()
      .from('cv_chats')
      .select('*')
      .eq('cv_id', cvId)
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) throw error
    return messages.reverse()
  },

  async delete(id: number) {
    const { error } = await createClient()
      .from('cv_chats')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async subscribeToChat(cvId: string, callback: (payload: any) => void) {
    const subscription = createClient()
      .channel(`chat_${cvId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cv_chats',
          filter: `cv_id=eq.${cvId}`,
        },
        callback
      )
      .subscribe()

    return () => subscription.unsubscribe()
  },

  async createAssistantMessage(cvId: string, message: string) {
    return this.create({
      cv_id: cvId,
      message_text: message,
      sender_type: 'assistant' as ChatSenderType,
    })
  },

  async createUserMessage(cvId: string, userId: string, message: string) {
    return this.create({
      cv_id: cvId,
      user_id: userId,
      message_text: message,
      sender_type: 'user' as ChatSenderType,
    })
  },
} 