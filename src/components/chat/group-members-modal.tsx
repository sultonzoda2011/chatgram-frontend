import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Loader2, Search, UserPlus, X, UserMinus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { addMember, removeMember } from '../../api/chatApi'
import { getUsers } from '../../api/userApi'
import type { IConversation } from '../../types/chat'
import type { IUser, IUsers } from '../../types/user'
import { Button } from '../ui/button'
import { Input } from '../ui/input/input'
import { getJwtFromCookie } from '../../lib/utils/jwt'
import { cn } from '../../lib/utils/cn'

interface GroupMembersModalProps {
  conversation: IConversation
  open: boolean
  onClose: () => void
}

export const GroupMembersModal = ({ conversation, open, onClose }: GroupMembersModalProps) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const currentUserId = getJwtFromCookie()?.sub
  const currentMember = conversation.members.find((member) => member.user.id === currentUserId)
  const canManage = currentMember?.role === 'OWNER' || currentMember?.role === 'ADMIN'
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery<IUsers>({
    queryKey: ['group-member-search', conversation.id, search],
    queryFn: () => getUsers(search),
    enabled: open && canManage && search.trim().length > 0,
  })

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['chatList'] })
    setSearch('')
  }
  const addMutation = useMutation({ mutationFn: (userId: number) => addMember({ conversationId: conversation.id, userId }), onSuccess: refresh })
  const removeMutation = useMutation({ mutationFn: (userId: number) => removeMember({ conversationId: conversation.id, userId }), onSuccess: refresh })

  const memberIds = new Set(conversation.members.map((member) => member.user.id))
  const availableUsers = data?.data.filter((user) => !memberIds.has(user.id)) ?? []
  const busy = addMutation.isPending || removeMutation.isPending

  if (!open) return null
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div className="w-full max-w-lg rounded-2xl border border-border/60 bg-card p-5 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="group-members-title">
      <div className="mb-4 flex items-center justify-between"><div><h2 id="group-members-title" className="font-bold">{t('group.members')}</h2><p className="text-xs text-muted-foreground">{conversation.name} · {conversation.members.length}</p></div><Button type="button" variant="ghost" size="icon" onClick={onClose}><X size={18} /></Button></div>
      <div className="max-h-64 space-y-2 overflow-y-auto pr-1">{conversation.members.map((member) => { const canRemove = canManage && member.role !== 'OWNER' && member.user.id !== currentUserId && !(currentMember?.role === 'ADMIN' && member.role === 'ADMIN'); return <div key={member.user.id} className="flex items-center gap-3 rounded-xl border border-border/40 p-2"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">{member.user.fullname.charAt(0).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{member.user.fullname}</p><p className="text-xs text-muted-foreground">@{member.user.username} · {member.role.toLowerCase()}</p></div>{canRemove && <Button type="button" variant="ghost" size="icon-sm" disabled={busy} onClick={() => removeMutation.mutate(member.user.id)} title={t('group.removeMember')}><UserMinus size={16} className="text-destructive" /></Button>}</div> })}</div>
      {canManage && <div className="mt-5 border-t border-border/50 pt-4"><p className="mb-2 text-sm font-semibold">{t('group.addMember')}</p><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('group.searchUsers')} className="pl-9" /></div><div className="mt-2 max-h-40 overflow-y-auto">{isLoading ? <div className="flex justify-center p-4"><Loader2 size={18} className="animate-spin" /></div> : availableUsers.map((user: IUser) => <button type="button" key={user.id} disabled={busy} onClick={() => addMutation.mutate(user.id)} className={cn('flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-secondary')}><div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold">{user.fullname.charAt(0).toUpperCase()}</div><span className="flex-1 truncate text-sm">{user.fullname}<span className="ml-2 text-xs text-muted-foreground">@{user.username}</span></span><UserPlus size={16} className="text-primary" /></button>)}</div></div>}
      {(addMutation.isError || removeMutation.isError) && <p className="mt-3 text-sm text-destructive">{t('group.membersError')}</p>}
    </div>
  </div>
}
