import { SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ConversationItem } from './conversation-item'
import { SearchResultItem } from './search-result-item'
import type { IConversation } from '../../types/chat'
import type { IUser } from '../../types/user'

interface ConversationListProps {
  conversations: IConversation[] | undefined
  searchResults: IUser[] | undefined
  isLoading: boolean
  isCollapsed: boolean
  isMobileOpen: boolean
  activeConversationId: string | null
  query: string
  onItemClick?: () => void
}

export const ConversationList = ({
  conversations,
  searchResults,
  isLoading,
  isCollapsed,
  isMobileOpen,
  activeConversationId,
  query,
  onItemClick,
}: ConversationListProps) => {
  const { t } = useTranslation()
  const isSearching = query.length > 0

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

  const items = isSearching ? searchResults : conversations

  if (!items?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground opacity-60">
        <SearchX size={32} className="mb-2" />
        {(!isCollapsed || isMobileOpen) && (
          <p className="text-xs">{isSearching ? t('sidebar.noUsers') : t('sidebar.noChats')}</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
      {isSearching
        ? (searchResults ?? []).map((user) => (
            <SearchResultItem
              key={user.id}
              user={user}
              isCollapsed={isCollapsed}
              isMobileOpen={isMobileOpen}
              onNavigated={onItemClick}
            />
          ))
        : (conversations ?? []).map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={activeConversationId === String(conversation.id)}
              isCollapsed={isCollapsed}
              isMobileOpen={isMobileOpen}
              onItemClick={onItemClick}
            />
          ))}
    </div>
  )
}
