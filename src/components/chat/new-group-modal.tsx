import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Users, X } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useSearchUsers, useCreateGroup } from '../../hooks/useChat'
import { Button } from '../ui/button'
import { Input } from '../ui/input/input'
import { Label } from '../ui/label'
import { cn } from '../../lib/utils/cn'
import type { IUser } from '../../types/user'

interface NewGroupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewGroupModal({ open, onOpenChange }: NewGroupModalProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<IUser[]>([])

  const { data: usersData, isLoading } = useSearchUsers(query)
  const { mutate: create, isPending } = useCreateGroup()

  if (!open) return null

  const toggleUser = (user: IUser) => {
    setSelected((prev) =>
      prev.some((u) => u.id === user.id) ? prev.filter((u) => u.id !== user.id) : [...prev, user],
    )
  }

  const handleClose = () => {
    setName('')
    setQuery('')
    setSelected([])
    onOpenChange(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || selected.length === 0) return

    create(
      { name: name.trim(), memberIds: selected.map((u) => u.id) },
      {
        onSuccess: (response) => {
          toast.success(t('group.created'))
          handleClose()
          navigate(`/chat/${response.data.id}`)
        },
        onError: () => toast.error(t('group.createError')),
      },
    )
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="flex items-center gap-2">
          <Users size={22} className="text-primary" />
          {t('group.newGroup')}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="group-name">{t('group.name')}</Label>
            <Input
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('group.namePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="group-members">{t('group.members')}</Label>
            <Input
              id="group-members"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('sidebar.search')}
            />

            {selected.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {selected.map((user) => (
                  <span
                    key={user.id}
                    className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                  >
                    {user.fullname}
                    <button
                      type="button"
                      onClick={() => toggleUser(user)}
                      className="rounded-full p-0.5 hover:bg-primary/20"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {query.length > 0 && (
              <div className="max-h-48 overflow-y-auto rounded-2xl border border-border/50 divide-y divide-border/30">
                {isLoading && (
                  <p className="p-3 text-xs text-muted-foreground">{t('common.loading')}</p>
                )}
                {!isLoading && usersData?.data.length === 0 && (
                  <p className="p-3 text-xs text-muted-foreground">{t('sidebar.noUsers')}</p>
                )}
                {usersData?.data.map((user) => {
                  const isSelected = selected.some((u) => u.id === user.id)
                  return (
                    <button
                      type="button"
                      key={user.id}
                      onClick={() => toggleUser(user)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 text-left hover:bg-secondary/50 transition-colors',
                        isSelected && 'bg-primary/5',
                      )}
                    >
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0">
                        {user.fullname.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium flex-1 truncate">{user.fullname}</span>
                      {isSelected && <span className="text-primary text-xs font-bold">✓</span>}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <Button type="submit" disabled={!name.trim() || selected.length === 0 || isPending}>
              {t('group.create')}
            </Button>
            <Button variant="ghost" type="button" onClick={handleClose}>
              {t('profile.cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
