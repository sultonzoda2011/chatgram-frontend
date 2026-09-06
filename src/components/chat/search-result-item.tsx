import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useOpenDirectConversation } from '../../hooks/useChat'
import { useSocketContext } from '../../lib/socket/SocketProvider'
import type { IUser } from '../../types/user'

interface SearchResultItemProps {
  user: IUser
  isCollapsed: boolean
  isMobileOpen: boolean
  onNavigated?: () => void
}

export const SearchResultItem = ({
  user,
  isCollapsed,
  isMobileOpen,
  onNavigated,
}: SearchResultItemProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { onlineUserIds } = useSocketContext()
  const { mutate: openDirect, isPending } = useOpenDirectConversation()

  const handleClick = () => {
    if (isPending) return
    openDirect(user.id, {
      onSuccess: (response) => {
        navigate(`/chat/${response.data.id}`)
        onNavigated?.()
      },
      onError: () => toast.error(t('chat.somethingWrong')),
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/80 transition-all duration-200 text-left disabled:opacity-60"
    >
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border/50">
          <span className="text-sm font-bold opacity-70">{user.fullname.charAt(0).toUpperCase()}</span>
        </div>
        {onlineUserIds.has(user.id) && (
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
        )}
      </div>

      {(!isCollapsed || isMobileOpen) && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 min-w-0"
        >
          <p className="font-semibold text-sm truncate">{user.fullname}</p>
          <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
        </motion.div>
      )}
    </button>
  )
}
