import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addMember,
  createGroup,
  deleteMessage,
  getConversations,
  getMessages,
  openDirectConversation,
  sendMessage,
  updateMessage,
} from '../api/chatApi'
import { searchUsers } from '../api/userApi'
import type { IApiResponse, IConversation, IMessage } from '../types/chat'
import type { IUser } from '../types/user'

export const conversationsKey = ['conversations'] as const
export const messagesKey = (conversationId: number) => ['messages', conversationId] as const

export function useConversations() {
  return useQuery<IApiResponse<IConversation[]>>({
    queryKey: conversationsKey,
    queryFn: getConversations,
  })
}

export function useMessages(conversationId: number | undefined) {
  return useQuery<IApiResponse<IMessage[]>>({
    queryKey: messagesKey(conversationId ?? 0),
    queryFn: () => getMessages(conversationId!),
    enabled: !!conversationId,
  })
}

export function useSearchUsers(query: string) {
  return useQuery<IApiResponse<IUser[]>>({
    queryKey: ['users', query],
    queryFn: () => searchUsers(query),
    enabled: query.length > 0,
  })
}

export function useOpenDirectConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: openDirectConversation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: conversationsKey }),
  })
}

export function useCreateGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: conversationsKey }),
  })
}

export function useAddMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addMember,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: conversationsKey }),
  })
}

export function useSendMessage(conversationId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesKey(conversationId) })
      queryClient.invalidateQueries({ queryKey: conversationsKey })
    },
  })
}

export function useEditMessage(conversationId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesKey(conversationId) })
      queryClient.invalidateQueries({ queryKey: conversationsKey })
    },
  })
}

export function useDeleteMessage(conversationId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesKey(conversationId) })
      queryClient.invalidateQueries({ queryKey: conversationsKey })
    },
  })
}
