import { api } from '../lib/utils/axiosConfig'

export const getChatList = async () => {
  const response = await api.get('/chat/chats')
  return response.data
}

export const sendMessage = async ({ toUserId, content }: { toUserId: number; content: string }) => {
  const response = await api.post(`/chat/send/${toUserId}`, { content })
  return response.data
}

export const getMessage = async (userId: number, since?: string) => {
  const response = await api.get(`/chat/messages/${userId}`, {
    params: since ? { since } : undefined,
  })

  return response.data
}
export const deleteMessage = async (messageId: number) => {
  const response = await api.delete(`/chat/messages/${messageId}`)
  return response.data
}

export const updateMessage = async ({
  messageId,
  content,
}: {
  messageId: number
  content: string
}) => {
  const response = await api.put(`/chat/messages/${messageId}`, { content })
  return response.data
}
