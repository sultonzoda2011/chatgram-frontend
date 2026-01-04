import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, PenBox } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getContacts } from '../../../api/contactsApi'
import type { IContact } from '../../../types/contacts'
import { Input } from '../../ui/input/input'
import UserItem from './user-item'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const { data: contacts, isLoading } = useQuery<IContact[]>({
    queryKey: ['getContacts'],
    queryFn: () => getContacts(),
  })
  const navigate = useNavigate()
  const filteredContacts = contacts?.filter((contact) =>
    contact.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="h-full w-70 md:w-86 flex flex-col bg-sidebar/50 backdrop-blur-xl border-r border-sidebar-border/50 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-40 bg-linear-to-b from-sidebar-primary/5 to-transparent pointer-events-none" />

      <div className="p-4 pt-6 pb-2 z-10 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h1 className="text-2xl font-black text-sidebar-primary">{t('sidebar.title')}</h1>
          <button className="p-2 rounded-xl hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-primary transition-colors">
            <PenBox size={20} />
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-sidebar-primary transition-colors duration-300" />
          <Input
            className="pl-9 bg-sidebar/50 border-sidebar-border/50 hover:bg-sidebar/80 focus:bg-sidebar h-10 rounded-xl"
            placeholder={t('sidebar.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-sidebar-accent/30 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-sidebar-accent/30 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-sidebar-accent/20 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredContacts?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2"
              >
                <Search className="w-8 h-8 opacity-20" />
                <p className="text-sm">{t('sidebar.noChats')}</p>
              </motion.div>
            ) : (
              filteredContacts?.map((contact) => (
                <UserItem key={contact.userId} onClick={() => {
                  navigate(`/chat/${contact.userId}`, {
                    state: {
                      name: contact.username,
                      avatar: contact.avatar
                    }
                  })
                }} contact={contact} />
              ))
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export default Sidebar
