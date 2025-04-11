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

  async subscribeToMessages(cvId: string, callback: (payload: any) => void) {
    const subscription = createClient()
      .channel('chat_messages_changes')
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

  async sendMessage(cvId: string, message: string, senderType: ChatSenderType = 'user') {
    const { data: chatMessage, error } = await createClient()
      .from('cv_chats')
      .insert({
        cv_id: cvId,
        message_text: message,
        sender_type: senderType,
      })
      .select()
      .single()

    if (error) throw error
    return chatMessage
  },
} 