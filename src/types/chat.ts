export type ConversationType = 'DIRECT' | 'GROUP'

export interface IConversationMemberUser {
  id: number
  username: string
  fullname: string
  avatarUrl: string | null
  isOnline: boolean
  lastSeenAt: string
}

export interface IConversationMember {
  user: IConversationMemberUser
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
}

export interface IMessageSender {
  id: number
  username: string
  fullname: string
  avatarUrl: string | null
}

export interface IMessage {
  id: number
  conversationId: number
  senderId: number
  content: string
  createdAt: string
  editedAt: string | null
  deletedAt: string | null
  sender: IMessageSender
}

export interface IConversation {
  id: number
  type: ConversationType
  name: string | null
  avatarUrl: string | null
  members: IConversationMember[]
  lastMessage: IMessage | null
  updatedAt: string
}

export interface IApiResponse<T> {
  status: string
  message: string
  data: T
}
