import { User } from 'lucide-react'
import { cn } from '../../lib/utils/cn'
import type { IUser } from '../../types/user'

interface UserSearchItemProps {
  user: IUser
  isCollapsed: boolean
  isMobileOpen: boolean
  onClick: (userId: number) => void
}

export const UserSearchItem = ({ user, isCollapsed, isMobileOpen, onClick }: UserSearchItemProps) => (
  <button
    type="button"
    onClick={() => onClick(user.id)}
    className={cn('w-full flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-secondary/80 text-left',
      isCollapsed && !isMobileOpen && 'justify-center')}
  >
    <div className="w-12 h-12 shrink-0 rounded-full bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border/50">
      {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" /> : <User size={18} />}
    </div>
    {(!isCollapsed || isMobileOpen) && (
      <div className="min-w-0">
        <p className="font-semibold text-sm truncate">{user.fullname}</p>
        <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
      </div>
    )}
  </button>
)
