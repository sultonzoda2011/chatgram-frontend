import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils/cn'
import { formatChatDate } from '../../lib/utils/date'
import type { IChats } from '../../types/chat'
import { useTranslation } from 'react-i18next'

interface UserItemProps {
    chat: IChats
    isActive: boolean
    isCollapsed: boolean
    isMobileOpen: boolean
    onItemClick?: () => void
}

export const UserItem = ({
    chat,
    isActive,
    isCollapsed,
    isMobileOpen,
    onItemClick,
}: UserItemProps) => {
    const { t } = useTranslation()

    return (
        <Link
            to={`/chat/${chat.id}`}
            onClick={onItemClick}
            className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group/item relative",
                isActive
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-secondary/80 text-foreground"
            )}
        >
            <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border/50">
                    <span className="text-sm font-bold opacity-70">
                        {chat.fullname.charAt(0).toUpperCase()}
                    </span>
                </div>
            </div>

            {(!isCollapsed || isMobileOpen) && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 min-w-0"
                >
                    <div className="flex justify-between items-start">
                        <p className="font-semibold text-sm truncate">{chat.fullname}</p>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {formatChatDate(chat.date)}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate italic">
                        {chat.last_message || t('chat.noMessages')}
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
