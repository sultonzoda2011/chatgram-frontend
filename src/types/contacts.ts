export interface LastMessage {
  content: string
  date: string
}
export interface Contact {
  userId: string
  username: string
  avatar: string
  lastMessage: LastMessage
  unreadCount: number
}

export interface UserItemProps {
  contact: Contact
  onClick?: () => void
}
