import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ImagePlus, Loader2, Search, Users, X } from 'lucide-react'
import { createGroup } from '../../api/chatApi'
import { getUsers } from '../../api/userApi'
import type { IUser, IUsers } from '../../types/user'
import { Button } from '../ui/button'
import { Input } from '../ui/input/input'
import { cn } from '../../lib/utils/cn'
import { useTranslation } from 'react-i18next'

interface CreateGroupModalProps {
  open: boolean
  onClose: () => void
}

export const CreateGroupModal = ({ open, onClose }: CreateGroupModalProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [search, setSearch] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([])
  const [avatar, setAvatar] = useState<File | undefined>()

  const { data, isLoading } = useQuery<IUsers>({
    queryKey: ['group-users', search],
    queryFn: () => getUsers(search),
    enabled: open && search.trim().length > 0,
  })

  const mutation = useMutation({
    mutationFn: () => createGroup({ name: name.trim(), memberIds: selectedUsers.map((user) => user.id), avatar }),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ['chatList'] })
      setName('')
      setSearch('')
      setSelectedUsers([])
      setAvatar(undefined)
      onClose()
      navigate(`/chat/${response.data.id}`)
    },
  })

  const toggleUser = (user: IUser) => {
    setSelectedUsers((current) => current.some((item) => item.id === user.id)
      ? current.filter((item) => item.id !== user.id)
      : [...current, user])
  }

  const close = () => {
    if (mutation.isPending) return
    setName('')
    setSearch('')
    setSelectedUsers([])
    setAvatar(undefined)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}>
      <div className="w-full max-w-lg rounded-2xl border border-border/60 bg-card p-5 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="create-group-title">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Users size={20} /></div>
            <div><h2 id="create-group-title" className="font-bold">{t('group.createTitle')}</h2><p className="text-xs text-muted-foreground">{t('group.selectMembers')}</p></div>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={close} aria-label={t('group.cancel')}><X size={18} /></Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3"><label className="flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-secondary/30">{avatar ? <img src={URL.createObjectURL(avatar)} alt="" className="h-full w-full object-cover" /> : <ImagePlus size={20} className="text-muted-foreground" />}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => setAvatar(event.target.files?.[0])} /></label><Input value={name} onChange={(event) => setName(event.target.value)} placeholder={t('group.namePlaceholder')} autoFocus /></div>
          {selectedUsers.length > 0 && <div className="flex flex-wrap gap-2">{selectedUsers.map((user) => <button type="button" key={user.id} onClick={() => toggleUser(user)} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{user.fullname}<X size={12} /></button>)}</div>}
          <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('group.searchUsers')} className="pl-9" /></div>
          <div className="max-h-52 overflow-y-auto rounded-xl border border-border/50 p-2">
            {!search.trim() ? <p className="p-4 text-center text-xs text-muted-foreground">{t('group.startSearch')}</p> : isLoading ? <div className="flex justify-center p-5"><Loader2 className="animate-spin text-primary" size={20} /></div> : data?.data.length ? data.data.map((user) => { const selected = selectedUsers.some((item) => item.id === user.id); return <button type="button" key={user.id} onClick={() => toggleUser(user)} className={cn('flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-secondary', selected && 'bg-primary/10')}><div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">{user.fullname.charAt(0).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{user.fullname}</p><p className="truncate text-xs text-muted-foreground">@{user.username}</p></div>{selected && <Check size={18} className="text-primary" />}</button> }) : <p className="p-4 text-center text-xs text-muted-foreground">{t('sidebar.noUsers')}</p>}
          </div>
        </div>

        {mutation.isError && <p className="mt-3 text-sm text-destructive">{t('group.error')}</p>}
        <div className="mt-5 flex justify-end gap-2"><Button type="button" variant="ghost" onClick={close}>{t('group.cancel')}</Button><Button type="button" disabled={!name.trim() || selectedUsers.length === 0 || mutation.isPending} onClick={() => mutation.mutate()}>{mutation.isPending && <Loader2 size={16} className="animate-spin" />}{t('group.create')}</Button></div>
      </div>
    </div>
  )
}
