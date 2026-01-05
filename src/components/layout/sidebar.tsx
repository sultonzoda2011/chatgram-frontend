import { useQuery } from '@tanstack/react-query'
import { getChatList } from '../../api/chatApi'
import { getUsers } from '../../api/userApi'
import { getProfile } from '../../api/authApi'
import type { IChatsResponse } from '../../types/chat'
import type { IProfileResponse } from '../../types/auth'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Search,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Settings,
  SearchX
} from 'lucide-react'
import { removeToken } from '../../lib/utils/cookie'
import { cn } from '../../lib/utils/cn'
import { LanguageSelect } from '../ui/language-select'
import ModeToggle from '../ui/mode-toggle'

const Sidebar = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const { data: profile } = useQuery<IProfileResponse>({
    queryKey: ['get-profile'],
    queryFn: getProfile,
  })

  const {
    data: dataChats,
    isLoading: isLoadingChats,
  } = useQuery<IChatsResponse>({
    queryKey: ['chatList'],
    queryFn: getChatList,
  })

  const {
    data: dataUsers,
    isLoading: isLoadingUsers,
  } = useQuery<IChatsResponse>({
    queryKey: ['users', query],
    queryFn: () => getUsers(query),
    enabled: query.length > 0,
  })

  const handleLogout = () => {
    removeToken()
    navigate('/login')
    window.location.reload()
  }

  const chatsToRender = query.length > 0 ? dataUsers?.data : dataChats?.data
  const isLoading = isLoadingChats || (query.length > 0 && isLoadingUsers)

  const activeChatId = useMemo(() => {
    const match = location.pathname.match(/\/chat\/(\d+)/)
    return match ? match[1] : null
  }, [location.pathname])

  return (
    <motion.div
      animate={{ width: isCollapsed ? 80 : 320 }}
      className="h-full border-r border-border/50 bg-card/50 backdrop-blur-xl flex flex-col relative z-20 group"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-2 rounded-xl bg-primary shadow-lg shadow-primary/20 flex-shrink-0"
            whileHover={{ rotate: [0, -10, 10, 0] }}
          >
            <MessageCircle size={20} className="text-primary-foreground" />
          </motion.div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent truncate"
            >
              ChatApp
            </motion.span>
          )}
        </div>
        {!isCollapsed && (
          <div className="flex items-center gap-1 scale-75 origin-right">
            <LanguageSelect />
            <ModeToggle />
          </div>
        )}
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative group/search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isCollapsed ? "" : t('sidebar.search')}
            className={cn(
              "w-full bg-secondary/50 border border-border/50 rounded-xl py-2 pl-10 pr-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
              isCollapsed && "pl-8 pr-0 opacity-0 group-hover:opacity-100"
            )}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col gap-4 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-muted" />
                {!isCollapsed && (
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-2 bg-muted rounded w-3/4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : chatsToRender?.length ? (
          chatsToRender.map((chat) => (
            <Link
              to={`/chat/${chat.id}`}
              key={chat.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group/item relative",
                activeChatId === String(chat.id)
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
                {/* Status indicator - purely decorative for now */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
              </div>

              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 min-w-0"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm truncate">{chat.fullname}</p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {chat.date}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate italic">
                    {chat.last_message || t('chat.noMessages')}
                  </p>
                </motion.div>
              )}

              {activeChatId === String(chat.id) && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                />
              )}
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground opacity-60">
            <SearchX size={32} className="mb-2" />
            {!isCollapsed && <p className="text-xs">{query ? t('sidebar.noUsers') : t('sidebar.noChats')}</p>}
          </div>
        )}
      </div>

      {/* Footer / Profile */}
      <div className="p-4 border-t border-border/50 bg-background/30 backdrop-blur-sm">
        <div className="flex flex-col gap-2">
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl transition-colors cursor-pointer hover:bg-secondary/50",
              isCollapsed ? "justify-center" : ""
            )}
            onClick={() => navigate('/profile')}
          >
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-accent/20 to-primary/20 flex items-center justify-center border border-border/50">
              <User size={18} className="text-foreground" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{profile?.data.fullname}</p>
                <p className="text-[10px] text-muted-foreground truncate">@{profile?.data.username}</p>
              </div>
            )}
          </div>

          <div className="flex gap-1">
            <button
              onClick={handleLogout}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 p-2 rounded-xl text-destructive hover:bg-destructive/10 transition-colors",
                isCollapsed ? "w-10" : ""
              )}
              title={t('sidebar.logout')}
            >
              <LogOut size={18} />
              {!isCollapsed && <span className="text-xs font-semibold">{t('sidebar.logout')}</span>}
            </button>
            {!isCollapsed && (
              <button
                onClick={() => navigate('/profile')}
                className="p-2 rounded-xl text-muted-foreground hover:bg-secondary/50 transition-colors"
                title={t('sidebar.settings')}
              >
                <Settings size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Collapse Button */}
      {isCollapsed && (
        <div className="flex flex-col items-center gap-4 py-4 border-t border-border/50">
          <LanguageSelect />
          <ModeToggle />
        </div>
      )}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border flex items-center justify-center rounded-full shadow-md z-30 hover:bg-secondary transition-colors"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.div>
  )
}

export default Sidebar
