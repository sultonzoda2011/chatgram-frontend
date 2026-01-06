import { SearchX } from 'lucide-react'
import type { IChats } from '../../types/chat'
import { UserItem } from './user-item'
import { useTranslation } from 'react-i18next'

interface UserListProps {
    items: IChats[] | undefined
    isLoading: boolean
    isCollapsed: boolean
    isMobileOpen: boolean
    activeChatId: string | null
    query: string
    onItemClick?: () => void
}

export const UserList = ({
    items,
    isLoading,
    isCollapsed,
    isMobileOpen,
    activeChatId,
    query,
    onItemClick,
}: UserListProps) => {
    const { t } = useTranslation()

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-12 h-12 rounded-full bg-muted" />
                        {(!isCollapsed || isMobileOpen) && (
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-3 bg-muted rounded w-1/2" />
                                <div className="h-2 bg-muted rounded w-3/4" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    if (!items?.length) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground opacity-60">
                <SearchX size={32} className="mb-2" />
                {(!isCollapsed || isMobileOpen) && (
                    <p className="text-xs">
                        {query ? t('sidebar.noUsers') : t('sidebar.noChats')}
                    </p>
                )}
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
            {items.map((chat) => (
                <UserItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChatId === String(chat.id)}
                    isCollapsed={isCollapsed}
                    isMobileOpen={isMobileOpen}
                    onItemClick={onItemClick}
                />
            ))}
        </div>
    )
}
