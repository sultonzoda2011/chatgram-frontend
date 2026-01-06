import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteMessage, getMessage, sendMessage, updateMessage } from '../../../api/chatApi'
import { useParams, useNavigate } from 'react-router-dom'
import type { IMessageResponse, IChatsResponse } from '../../../types/chat'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Send,
  MoreVertical,
  ArrowLeft,
  Loader2,
  User,
  MessageCircle,
  Trash2,
  Edit,
} from 'lucide-react'
import { cn } from '../../../lib/utils/cn'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input/input'

const Chat = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams()
  const [message, setMessage] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', id] })
      queryClient.invalidateQueries({ queryKey: ['chatList'] })
    },
  })

  const { mutate: updateMutate } = useMutation({
    mutationFn: updateMessage,
    onSuccess: () => {
      setMessage('')
      setEditId(null)
      queryClient.invalidateQueries({ queryKey: ['chat', id] })
      queryClient.invalidateQueries({ queryKey: ['chatList'] })
    },
  })

  const { data: messagesData, isLoading: isLoadingMessages } = useQuery<IMessageResponse>({
    queryKey: ['chat', id],
    queryFn: () => getMessage(Number(id)),
    enabled: !!id,
    refetchInterval: 3000,
  })

  const { data: chatsData } = useQuery<IChatsResponse>({
    queryKey: ['chatList'],
  })

  const { mutate: send, isPending: isSending } = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      setMessage('')
      queryClient.invalidateQueries({ queryKey: ['chat', id] })
      queryClient.invalidateQueries({ queryKey: ['chatList'] })
    
    },
  })

  const currentUser = chatsData?.data.find((c) => String(c.id) === id)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messagesData])

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!message.trim() || isSending) return
    if (editId) {
      updateMutate({ messageId: editId, content: message })
    } else {
      send({ toUserId: Number(id), content: message })
    }
  }

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/50 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="lg:hidden rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border/50">
              <span className="text-sm font-bold">
                {currentUser?.fullname?.charAt(0).toUpperCase() || <User size={18} />}
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold leading-none mb-1 truncate max-w-37.5 sm:max-w-75">
              {currentUser?.fullname || `User #${id}`}
            </h2>
            <p className="text-[10px] text-green-500 font-medium">{t('chat.online')}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
            <MoreVertical size={18} />
          </Button>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-linear-to-b from-transparent to-primary/5"
      >
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
          </div>
        ) : messagesData?.data.length ? (
          messagesData.data.map((msg, idx) => {
            const isMe = String(msg.from_user_id) !== id
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.05, 0.5) }}
                className={cn(
                  'relative group flex items-end gap-2 max-w-[85%] sm:max-w-[70%]',
                  isMe ? 'ml-auto flex-row-reverse' : 'mr-auto',
                )}
              >
                {isMe && (
                  <div className="absolute -top-3 right-0 hidden group-hover:flex items-center gap-1 px-1.5 py-1 rounded-full bg-background/70 backdrop-blur-md border border-border/50 shadow-lg">
                    <button
                      onClick={() => {
                        setMessage(msg.content)
                        setEditId(msg.id)
                      }}
                      className="flex items-center justify-center w-7 h-7 rounded-full text-muted-foreground hover:text-white hover:bg-primary transition-all active:scale-95"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => deleteMutate(msg.id)}
                      className="flex items-center justify-center w-7 h-7 rounded-full text-muted-foreground hover:text-white hover:bg-red-500 transition-all active:scale-95"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}

                <div
                  className={cn(
                    'px-4 py-2 rounded-2xl text-sm shadow-sm',
                    isMe
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-card border border-border/50 rounded-bl-none',
                  )}
                >
                  <p className="wrap-break-word leading-relaxed">{msg.content}</p>
                  <p
                    className={cn(
                      'text-[8px] mt-1 text-right opacity-60 font-medium',
                      isMe ? 'text-primary-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {new Date(msg.date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-3 opacity-50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-5 rounded-full bg-secondary/50 border border-border/50 shadow-inner"
            >
              <MessageCircle size={32} />
            </motion.div>
            <p className="text-sm font-medium">{t('chat.noMessages')}</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border/50">
        <form onSubmit={handleSend} className="relative flex items-center gap-3 max-w-4xl mx-auto">
          <div className="relative flex-1 group">
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('chat.typeMessage')}
              className="h-12 bg-secondary/40 border-border/40 rounded-2xl pr-12 focus:bg-background transition-all"
            />
          </div>
          <Button
            type="submit"
            disabled={!message.trim() || isSending}
            size="icon"
            className={cn(
              'w-12 h-12 rounded-2xl shadow-lg transition-all active:scale-95',
              !message.trim() || isSending
                ? 'grayscale opacity-50 shadow-none'
                : 'shadow-primary/20',
            )}
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send size={18} className={cn(message.trim() ? 'translate-x-0.5' : '')} />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Chat
