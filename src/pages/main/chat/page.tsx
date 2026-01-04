import { useEffect, useState, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useWebSocket } from '../../../lib/hooks/use-websocket'
import type { Message } from '../../../types/messages'
import { Send } from 'lucide-react'

import { getContacts } from '../../../api/contactsApi'
import { getMessages } from '../../../api/messageApi'

const Chat = () => {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const recipientId = id || ''

  const [recipientName, setRecipientName] = useState(location.state?.name || 'User')
  const [recipientAvatar, setRecipientAvatar] = useState(location.state?.avatar)

  const { socket, sendMessage, sendTyping, isConnected } = useWebSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (recipientName !== 'User' || !recipientId) return
    getContacts()
      .then((contacts) => {
        const contact = contacts.find((c: { userId: string }) => c.userId === recipientId)
        if (contact) {
          setRecipientName(contact.username)
          setRecipientAvatar(contact.avatar)
        }
      })
      .catch(() => undefined)
  }, [recipientId, recipientName])

  useEffect(() => {
    if (!recipientId) return
    getMessages({ userId: recipientId })
      .then((msgs) => {
        setMessages(msgs)
        setTimeout(scrollToBottom, 100)
      })
      .catch(() => undefined)
  }, [recipientId])

  useEffect(() => {
    if (!socket) return
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'message' || data.type === 'sent') {
          if (data.fromUserId === recipientId || data.toUserId === recipientId) {
            setMessages((prev) => [...prev, data])
            scrollToBottom()
          }
        } else if (data.type === 'typing') {
          if (data.fromUserId === recipientId) {
            setIsTyping(data.isTyping)
          }
        }
      } catch {
        void 0
      }
    }

    socket.addEventListener('message', handleMessage)
    return () => socket.removeEventListener('message', handleMessage)
  }, [socket, recipientId])

  const handleSend = () => {
    if (!input.trim() || !recipientId) return
    sendMessage(input, recipientId)
    setInput('')
    sendTyping(recipientId, false)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)

    sendTyping(recipientId, true)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      if (recipientId) sendTyping(recipientId, false)
    }, 1500)
  }

  if (!recipientId)
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a chat to start messaging
      </div>
    )

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="flex items-center p-4 border-b border-border/50 bg-card/30 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          {recipientAvatar ? (
            <img
              src={recipientAvatar}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-border"
              alt={recipientName}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
              {recipientName.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              {recipientName}
            </h2>
            <div className="flex items-center gap-2 text-xs font-medium h-4">
              {isTyping ? (
                <span className="text-primary flex items-center gap-1">
                  <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1 h-1 bg-primary rounded-full animate-bounce"></span>
                  Typing
                </span>
              ) : (
                <span className={isConnected ? 'text-green-500' : 'text-muted-foreground'}>
                  {isConnected ? 'Connected' : 'Connecting...'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar z-10">
        {messages.map((msg, i) => {
          const isMe = msg.fromUserId !== recipientId
          return (
            <div
              key={msg.id || i}
              className={`flex ${
                isMe ? 'justify-end' : 'justify-start'
              } group animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[70%] p-3 px-4 shadow-sm transition-all duration-200 ${
                  isMe
                    ? 'bg-linear-to-br from-primary to-blue-600 text-primary-foreground rounded-2xl rounded-tr-sm hover:shadow-primary/20 hover:shadow-md'
                    : 'bg-muted/80 backdrop-blur-sm text-foreground rounded-2xl rounded-tl-sm hover:bg-muted'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <span
                  className={`text-[10px] block text-right mt-1 ${
                    isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  {new Date(msg.date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border/50 bg-card/30 backdrop-blur-xl z-20">
        <div className="flex gap-2 max-w-4xl mx-auto relative group-focus-within:scale-[1.01] transition-transform duration-300">
          <input
            className="flex-1 bg-muted/50 border border-border/50 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-background transition-all shadow-inner placeholder:text-muted-foreground/50"
            placeholder={`Message ${recipientName}...`}
            value={input}
            onChange={handleInput}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 bg-primary text-primary-foreground rounded-2xl hover:opacity-90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale shadow-lg shadow-primary/20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
export default Chat
