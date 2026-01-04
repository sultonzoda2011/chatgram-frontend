export interface ILastMessage {
  content: string
  date: string
}
export interface IContact {
  userId: string
  username: string
  avatar: string
  lastMessage: ILastMessage
  unreadCount: number
}
