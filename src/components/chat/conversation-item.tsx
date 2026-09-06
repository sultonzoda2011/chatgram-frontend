import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { cn } from '../../lib/utils/cn'
import { formatChatDate } from '../../lib/utils/date'
import { useSocketContext } from '../../lib/socket/SocketProvider'
import { useCurrentUserId } from '../../hooks/useCurrentUserId'
import type { IConversation } from '../../types/chat'
import { useTranslation } from 'react-i18next'

interface ConversationItemProps {
  conversation: IConversation
  isActive: boolean
  isCollapsed: boolean
  isMobileOpen: boolean
  onItemClick?: () => void
}

export const ConversationItem = ({
  conversation,
  isActive,
  isCollapsed,
  isMobileOpen,
  onItemClick,
}: ConversationItemProps) => {
  const { t } = useTranslation()
  const { onlineUserIds } = useSocketContext()
  const currentUserId = useCurrentUserId()

  const otherMember = conversation.members.find((m) => m.user.id !== currentUserId)
  const isOnline =
    conversation.type === 'DIRECT' && !!otherMember && onlineUserIds.has(otherMember.user.id)

  const lastMessagePreview = conversation.lastMessage?.deletedAt
    ? t('chat.messageDeleted')
    : conversation.lastMessage?.content

  return (
    <Link
      to={`/chat/${conversation.id}`}
      onClick={onItemClick}
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group/item relative',
        isActive ? 'bg-primary/10 text-primary' : 'hover:bg-secondary/80 text-foreground',
      )}
    >
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border/50">
          {conversation.type === 'GROUP' ? (
            <Users size={18} className="opacity-70" />
          ) : (
            <span className="text-sm font-bold opacity-70">
              {conversation.name?.charAt(0).toUpperCase() ?? '?'}
            </span>
          )}
        </div>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
        )}
      </div>

      {(!isCollapsed || isMobileOpen) && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 min-w-0"
        >
          <div className="flex justify-between items-start">
            <p className="font-semibold text-sm truncate">{conversation.name}</p>
            {conversation.lastMessage && (
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {formatChatDate(conversation.lastMessage.createdAt)}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate italic">
            {lastMessagePreview || t('chat.noMessages')}
          </p>
        </motion.div>
      )}

      {isActive && (
        <motion.div
          layoutId="active-pill"
          className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
        />
      )}
    </Link>
  )
}
