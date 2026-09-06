export interface IUser {
  id: number
  username: string
  fullname: string
  avatarUrl: string | null
  isOnline: boolean
  lastSeenAt: string
}
