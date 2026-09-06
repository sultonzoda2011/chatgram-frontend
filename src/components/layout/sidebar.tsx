import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getChatList, openDirectConversation } from '../../api/chatApi'
import { getUsers } from '../../api/userApi'
import type { IChatsResponse } from '../../types/chat'
import type { IUsers } from '../../types/user'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Search, LogOut, ChevronLeft, ChevronRight, Settings, Menu, Plus } from 'lucide-react'
import { removeToken } from '../../lib/utils/cookie'
import { cn } from '../../lib/utils/cn'
import { Button } from '../ui/button'
import { Input } from '../ui/input/input'
import { Logo } from '../ui/logo'
import { UserList } from '../chat/user-list'
import { CreateGroupModal } from '../chat/create-group-modal'

const Sidebar = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [query, setQuery] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)

  const { data: dataChats, isLoading: isLoadingChats } = useQuery<IChatsResponse>({ queryKey: ['chatList'], queryFn: getChatList })
  const { data: dataUsers, isLoading: isLoadingUsers } = useQuery<IUsers>({ queryKey: ['users', query], queryFn: () => getUsers(query), enabled: query.trim().length > 0 })

  const handleOpenUser = async (userId: number) => {
    const response = await openDirectConversation(userId)
    await queryClient.invalidateQueries({ queryKey: ['chatList'] })
    setQuery('')
    setIsMobileOpen(false)
    navigate(`/chat/${response.data.id}`)
  }

  const handleLogout = () => { removeToken(); navigate('/login'); window.location.reload() }
  const activeChatId = useMemo(() => location.pathname.match(/\/chat\/(\d+)/)?.[1] ?? null, [location.pathname])
  const searching = query.trim().length > 0
  const compact = isCollapsed && !isMobileOpen

  const sidebarContent = <div className="h-full flex flex-col bg-card/50 backdrop-blur-xl">
    <div className="p-4 flex items-center justify-between overflow-hidden"><Logo isCollapsed={compact} /></div>
    <div className="px-4 mb-3"><div className="relative group/search"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" /><Input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={compact ? '' : t('sidebar.search')} className={cn('h-10 pl-10 pr-4 text-sm', compact && 'opacity-0 group-hover/search:opacity-100')} /></div></div>
    {!searching && <div className="px-4 mb-3"><Button type="button" variant="secondary" size={compact ? 'icon' : 'default'} onClick={() => setIsGroupModalOpen(true)} className={cn('w-full', compact && 'px-0')} title={t('group.create')}><Plus size={16} />{!compact && <span>{t('group.create')}</span>}</Button></div>}
    <UserList conversations={searching ? undefined : dataChats?.data} users={searching ? dataUsers?.data : undefined} isLoading={searching ? isLoadingUsers : isLoadingChats} isCollapsed={isCollapsed} isMobileOpen={isMobileOpen} activeChatId={activeChatId} query={query} onUserClick={handleOpenUser} onItemClick={() => setIsMobileOpen(false)} />
    <div className="p-4 border-t border-border/50 bg-background/30"><div className="flex gap-1"><Button variant="ghost" size={compact ? 'icon' : 'default'} onClick={handleLogout} className={cn('flex-1 text-destructive hover:bg-destructive/10 rounded-xl', compact && 'aspect-square p-0 flex-none')} title={t('sidebar.logout')}><LogOut size={18} />{!compact && <span className="text-xs font-semibold ml-2">{t('sidebar.logout')}</span>}</Button>{!compact && <Button variant="secondary" size="icon" onClick={() => { navigate('/profile'); setIsMobileOpen(false) }} className="rounded-xl" title={t('sidebar.settings')}><Settings size={18} /></Button>}</div></div>
  </div>

  return <><CreateGroupModal open={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} /><AnimatePresence>{isMobileOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileOpen(false)} className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40" />}</AnimatePresence><motion.div animate={{ x: isMobileOpen ? 0 : window.innerWidth < 1024 ? -320 : 0, width: isCollapsed ? 80 : 320 }} transition={{ type: 'spring', damping: 20, stiffness: 100 }} className={cn('h-full border-r border-border/50 flex flex-col relative z-40 group shrink-0', 'fixed lg:relative inset-y-0 left-0 lg:left-auto')}>{sidebarContent}<Button variant="secondary" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 border border-border items-center justify-center rounded-full shadow-md z-50 p-0">{isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}</Button></motion.div>{!isMobileOpen && <div className="lg:hidden absolute top-4 left-4 z-50"><Button variant="secondary" size="icon" className="rounded-full shadow-lg" onClick={() => setIsMobileOpen(true)}><Menu size={20} /></Button></div>}</>
}
export default Sidebar
