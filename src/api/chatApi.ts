import { api } from '../lib/utils/axiosConfig'
import type {
  IAddMemberInput,
  IChatsResponse,
  IConversationResponse,
  ICreateGroupInput,
  IGetMessagesParams,
  IMessageResponse,
  ISendMessageInput,
  IUpdateMessageInput,
} from '../types/chat'

export const getChatList = async (): Promise<IChatsResponse> => {
  const response = await api.get<IChatsResponse>('/chat/conversations')
  return response.data
}

export const openDirectConversation = async (userId: number): Promise<IConversationResponse> => {
  const response = await api.post<IConversationResponse>(`/chat/conversations/direct/${userId}`)
  return response.data
}

export const createGroup = async (data: ICreateGroupInput): Promise<IConversationResponse> => {
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('memberIds', JSON.stringify(data.memberIds))
  if (data.avatar) formData.append('avatar', data.avatar)
  const response = await api.post<IConversationResponse>('/chat/conversations/group', formData)
  return response.data
}

export const uploadGroupAvatar = async (conversationId: number, image: File): Promise<IConversationResponse> => {
  const formData = new FormData()
  formData.append('image', image)
  const response = await api.post<IConversationResponse>(`/chat/conversations/${conversationId}/avatar`, formData)
  return response.data
}

export const removeGroupAvatar = async (conversationId: number): Promise<IConversationResponse> => {
  const response = await api.delete<IConversationResponse>(`/chat/conversations/${conversationId}/avatar`)
  return response.data
}

export const addMember = async ({ conversationId, userId }: IAddMemberInput) => {
  const response = await api.post(`/chat/conversations/${conversationId}/members`, { userId })
  return response.data
}

export const removeMember = async ({ conversationId, userId }: IAddMemberInput) => {
  const response = await api.delete(`/chat/conversations/${conversationId}/members/${userId}`)
  return response.data
}

export const getMessages = async (
  conversationId: number,
  params?: IGetMessagesParams,
): Promise<IMessageResponse> => {
  const response = await api.get<IMessageResponse>(`/chat/conversations/${conversationId}/messages`, {
    params,
  })
  return response.data
}

export const sendMessage = async ({ conversationId, content }: ISendMessageInput) => {
  const response = await api.post(`/chat/conversations/${conversationId}/messages`, { content })
  return response.data
}

export const deleteMessage = async (messageId: number) => {
  const response = await api.delete(`/chat/messages/${messageId}`)
  return response.data
}

export const updateMessage = async ({ messageId, content }: IUpdateMessageInput) => {
  const response = await api.patch(`/chat/messages/${messageId}`, { content })
  return response.data
}

export const getMessage = getMessages
