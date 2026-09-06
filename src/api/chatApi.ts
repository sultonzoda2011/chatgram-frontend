import { api } from '../lib/utils/axiosConfig'
import type { IApiResponse, IConversation, IMessage } from '../types/chat'

export const getConversations = async (): Promise<IApiResponse<IConversation[]>> => {
  const response = await api.get('/chat/conversations')
  return response.data
}

export const openDirectConversation = async (
  userId: number,
): Promise<IApiResponse<IConversation>> => {
  const response = await api.post(`/chat/conversations/direct/${userId}`)
  return response.data
}

export const createGroup = async (data: {
  name: string
  memberIds: number[]
}): Promise<IApiResponse<IConversation>> => {
  const response = await api.post('/chat/conversations/group', data)
  return response.data
}

export const addMember = async ({
  conversationId,
  userId,
}: {
  conversationId: number
  userId: number
}) => {
  const response = await api.post(`/chat/conversations/${conversationId}/members`, { userId })
  return response.data
}

export const getMessages = async (
  conversationId: number,
  cursor?: number,
): Promise<IApiResponse<IMessage[]>> => {
  const response = await api.get(`/chat/conversations/${conversationId}/messages`, {
    params: cursor ? { cursor } : undefined,
  })
  return response.data
}

export const sendMessage = async ({
  conversationId,
  content,
}: {
  conversationId: number
  content: string
}): Promise<IApiResponse<IMessage>> => {
  const response = await api.post(`/chat/conversations/${conversationId}/messages`, { content })
  return response.data
}

export const updateMessage = async ({
  messageId,
  content,
}: {
  messageId: number
  content: string
}): Promise<IApiResponse<IMessage>> => {
  const response = await api.patch(`/chat/messages/${messageId}`, { content })
  return response.data
}

export const deleteMessage = async (messageId: number): Promise<IApiResponse<null>> => {
  const response = await api.delete(`/chat/messages/${messageId}`)
  return response.data
}
