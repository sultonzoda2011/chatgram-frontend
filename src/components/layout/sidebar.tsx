import { useQuery } from '@tanstack/react-query'
import { getChatList } from '../../api/chatApi'
import { getUsers } from '../../api/userApi'
import type { IChatsResponse } from '../../types/chat'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Search, LogOut, ChevronLeft, ChevronRight, Settings, Menu } from 'lucide-react'
import { removeToken } from '../../lib/utils/cookie'
import { cn } from '../../lib/utils/cn'
import { Button } from '../ui/button'
import { Input } from '../ui/input/input'
import { Logo } from '../ui/logo'
import { UserList } from '../chat/user-list'

const Sidebar = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const { data: dataChats, isLoading: isLoadingChats } = useQuery<IChatsResponse>({
    queryKey: ['chatList'],
    queryFn: getChatList,
  })

  const { data: dataUsers, isLoading: isLoadingUsers } = useQuery<IChatsResponse>({
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

  const sidebarContent = (
    <div className="h-full flex flex-col bg-card/50 backdrop-blur-xl">
      <div className="p-4 flex items-center justify-between overflow-hidden">
        <Logo isCollapsed={isCollapsed && !isMobileOpen} />
      </div>

      <div className="px-4 mb-4">
        <div className="relative group/search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/search:text-primary transition-colors z-10" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isCollapsed && !isMobileOpen ? '' : t('sidebar.search')}
            className={cn(
              'h-10 pl-10 pr-4 text-sm transition-all',
              isCollapsed && !isMobileOpen && 'opacity-0 group-hover/search:opacity-100',
            )}
          />
        </div>
      </div>

      <UserList
        items={chatsToRender}
        isLoading={isLoading}
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        activeChatId={activeChatId}
        query={query}
        onItemClick={() => setIsMobileOpen(false)}
      />

      <div className="p-4 border-t border-border/50 bg-background/30 backdrop-blur-sm">
        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size={isCollapsed && !isMobileOpen ? 'icon' : 'default'}
              onClick={handleLogout}
              className={cn(
                'flex-1 text-destructive hover:bg-destructive/10 rounded-xl',
                isCollapsed && !isMobileOpen && 'aspect-square p-0 flex-none',
              )}
              title={t('sidebar.logout')}
            >
              <LogOut size={18} />
              {(!isCollapsed || isMobileOpen) && (
                <span className="text-xs font-semibold ml-2">{t('sidebar.logout')}</span>
              )}
            </Button>
            {(!isCollapsed || isMobileOpen) && (
              <Button
                variant="secondary"
                size="icon"
                onClick={() => {
                  navigate('/profile')
                  setIsMobileOpen(false)
                }}
                className="rounded-xl"
                title={t('sidebar.settings')}
              >
                <Settings size={18} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {!isMobileOpen && (
        <div className="lg:hidden absolute top-4 left-4 z-50">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu size={20} />
          </Button>
        </div>
      )}

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          x: isMobileOpen ? 0 : window.innerWidth < 1024 ? -320 : 0,
          width: isCollapsed ? 80 : 320,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className={cn(
          'h-full border-r border-border/50 flex flex-col relative z-40 group shrink-0',
          'fixed lg:relative inset-y-0 left-0 lg:left-auto',
        )}
      >
        {sidebarContent}

        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 border border-border items-center justify-center rounded-full shadow-md z-50 transition-colors p-0 flex-none aspect-square"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>
      </motion.div>
    </>
  )
}

export default Sidebar
