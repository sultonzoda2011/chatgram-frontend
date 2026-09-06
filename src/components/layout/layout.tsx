import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getToken } from '../../lib/utils/cookie'
import { connectChatSocket, disconnectChatSocket } from '../../lib/socket'
import Sidebar from './sidebar'
import { motion } from 'framer-motion'
import { Toaster } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import type { IDeletedMessageEvent, IMessage, IMessageEvent, IMessageResponse } from '../../types/chat'

const Layout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const token = getToken()

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    const socket = connectChatSocket()
    if (!socket) return

    const upsertMessage = (event: IMessageEvent) => {
      if (!event.conversationId) return
      queryClient.setQueryData<IMessageResponse>(['chat', String(event.conversationId)], (current) => {
        if (!current) return current
        const message = event as IMessage
        const messages = current.data.some((item) => item.id === message.id)
          ? current.data.map((item) => item.id === message.id ? { ...item, ...message } : item)
          : [...current.data, message]
        return { ...current, data: messages }
      })
      queryClient.invalidateQueries({ queryKey: ['chatList'] })
    }

    const removeMessage = (event: IDeletedMessageEvent) => {
      queryClient.setQueryData<IMessageResponse>(['chat', String(event.conversationId)], (current) => current ? { ...current, data: current.data.map((item) => item.id === event.id ? { ...item, deletedAt: new Date().toISOString(), content: '' } : item) } : current)
      queryClient.invalidateQueries({ queryKey: ['chatList'] })
    }

    socket.on('message:new', upsertMessage)
    socket.on('message:updated', upsertMessage)
    socket.on('message:deleted', removeMessage)
    return () => { socket.off('message:new', upsertMessage); socket.off('message:updated', upsertMessage); socket.off('message:deleted', removeMessage); disconnectChatSocket() }
  }, [navigate, queryClient, token])

  if (!token) return null
  return <div className="flex h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300"><div className="fixed inset-0 pointer-events-none overflow-hidden z-0"><motion.div className="absolute w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" animate={{ x: [0, 50, -30, 0], y: [0, -40, 60, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} style={{ left: '-10%', top: '10%' }} /><motion.div className="absolute w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" animate={{ x: [0, -60, 40, 0], y: [0, 50, -30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }} style={{ right: '-5%', bottom: '15%' }} /></div><Sidebar /><main className="flex-1 min-w-0 relative flex flex-col z-10"><Outlet /></main><Toaster position="top-center" expand={false} richColors /></div>
}
export default Layout
