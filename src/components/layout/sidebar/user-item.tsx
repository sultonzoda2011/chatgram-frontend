import type { UserItemProps } from '../../../types/contacts'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const UserItem = ({ contact, onClick }: UserItemProps) => {
  const { t } = useTranslation()

  const getInitials = (name: string) => {
    return name?.slice(0, 2).toUpperCase() || '??'
  }

  const formatTime = (dateStr: string) => {
    if (!dateStr) return ''
    try {
      const date = new Date(dateStr)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, backgroundColor: 'var(--sidebar-accent)' }}
      className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-sidebar-accent/50 border border-transparent hover:border-sidebar-border/50 backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-sidebar-primary/20 group-hover:border-sidebar-primary/50 transition-colors shadow-sm">
          {contact.avatar ? (
            <img
              src={contact.avatar}
              alt={contact.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-sidebar-primary/80 to-sidebar-accent flex items-center justify-center text-sidebar-primary-foreground font-bold">
              {getInitials(contact.username)}
            </div>
          )}
        </div>

        {contact.unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-background shadow-sm animate-pulse">
            {contact.unreadCount}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex justify-between items-start">
          <span className="font-semibold text-sidebar-foreground truncate text-sm">
            {contact.username}
          </span>
          {contact.lastMessage?.date && (
            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
              {formatTime(contact.lastMessage.date)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <p className="text-xs text-muted-foreground truncate group-hover:text-sidebar-foreground/80 transition-colors">
            {contact.lastMessage?.content || t('sidebar.noMessages')}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default UserItem
