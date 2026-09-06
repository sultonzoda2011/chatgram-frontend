import { useEffect, useState } from 'react'
import { useSocketContext } from '../lib/socket/SocketProvider'

interface TypingEvent {
  conversationId: number
  userId: number
  isTyping: boolean
}

export function useConversationRoom(conversationId: number | undefined) {
  const { socket } = useSocketContext()
  const [typingUserIds, setTypingUserIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!socket || !conversationId) return

    socket.emit('conversation:join', { conversationId })

    const handleTyping = (event: TypingEvent) => {
      if (event.conversationId !== conversationId) return
      setTypingUserIds((prev) => {
        const next = new Set(prev)
        if (event.isTyping) next.add(event.userId)
        else next.delete(event.userId)
        return next
      })
    }

    socket.on('typing', handleTyping)
    return () => {
      socket.off('typing', handleTyping)
      setTypingUserIds(new Set())
    }
  }, [socket, conversationId])

  const emitTyping = (isTyping: boolean) => {
    if (!socket || !conversationId) return
    socket.emit('typing', { conversationId, isTyping })
  }

  return { typingUserIds, emitTyping }
}
