import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Socket } from 'socket.io-client'
import { connectSocket, disconnectSocket } from './socket'
import type { IMessage } from '../../types/chat'

interface SocketContextValue {
  socket: Socket | null
  onlineUserIds: Set<number>
}

const SocketContext = createContext<SocketContextValue>({ socket: null, onlineUserIds: new Set() })

export function SocketProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [onlineUserIds, setOnlineUserIds] = useState<Set<number>>(new Set())
  const [socket] = useState<Socket>(() => connectSocket())

  useEffect(() => {
    const s = socket

    const handleNewMessage = (message: IMessage) => {
      queryClient.setQueryData<{ data: IMessage[] }>(
        ['messages', message.conversationId],
        (old) => (old ? { ...old, data: [...old.data, message] } : old),
      )
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    }

    const handleMessageUpdated = (message: IMessage) => {
      queryClient.setQueryData<{ data: IMessage[] }>(
        ['messages', message.conversationId],
        (old) =>
          old ? { ...old, data: old.data.map((m) => (m.id === message.id ? message : m)) } : old,
      )
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    }

    const handleMessageDeleted = (result: { id: number; conversationId: number }) => {
      queryClient.setQueryData<{ data: IMessage[] }>(
        ['messages', result.conversationId],
        (old) => (old ? { ...old, data: old.data.filter((m) => m.id !== result.id) } : old),
      )
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    }

    const handleUserOnline = ({ userId }: { userId: number }) => {
      setOnlineUserIds((prev) => new Set(prev).add(userId))
    }

    const handleUserOffline = ({ userId }: { userId: number }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    }

    s.on('message:new', handleNewMessage)
    s.on('message:updated', handleMessageUpdated)
    s.on('message:deleted', handleMessageDeleted)
    s.on('user:online', handleUserOnline)
    s.on('user:offline', handleUserOffline)

    return () => {
      s.off('message:new', handleNewMessage)
      s.off('message:updated', handleMessageUpdated)
      s.off('message:deleted', handleMessageDeleted)
      s.off('user:online', handleUserOnline)
      s.off('user:offline', handleUserOffline)
      disconnectSocket()
    }
  }, [socket, queryClient])

  return (
    <SocketContext.Provider value={{ socket, onlineUserIds }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocketContext() {
  return useContext(SocketContext)
}
