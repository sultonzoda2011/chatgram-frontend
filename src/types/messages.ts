export interface Message {
  id: string
  content: string
  fromUserId: string
  toUserId: string
  date: string
  fromUsername?: string
  read?: boolean
}

export interface MessagePagination {
  userId: string
  limit?: number
  before?: string | null
}
