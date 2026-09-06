export type ConversationType = 'DIRECT' | 'GROUP'

export interface IUserSummary {
  id: number
  username: string
  fullname: string
  avatarUrl?: string | null
  isOnline?: boolean
  lastSeenAt?: string | null
}

export interface IConversationMember {
  user: IUserSummary
  role: string
}

export interface IMessage {
  id: number
  conversationId: number
  senderId: number
  content: string
  createdAt: string
  editedAt?: string | null
  deletedAt?: string | null
  sender: IUserSummary
}

export interface IConversation {
  id: number
  type: ConversationType
  name?: string | null
  avatarUrl?: string | null
  members: IConversationMember[]
  lastMessage?: IMessage | null
  updatedAt: string
}

export interface IChatsResponse {
  status: string
  message: string
  data: IConversation[]
}

export interface IMessageResponse {
  status: string
  message: string
  data: IMessage[]
}

export interface IConversationResponse {
  status: string
  message: string
  data: IConversation
}

export interface IMessageEvent {
  id: number
  conversationId: number
  senderId?: number
  content?: string
  createdAt?: string
  editedAt?: string | null
  deletedAt?: string | null
  sender?: IUserSummary
}

export interface IDeletedMessageEvent {
  id: number
  conversationId: number
}

export interface ISendMessageInput {
  conversationId: number
  content: string
}

export interface IUpdateMessageInput {
  messageId: number
  content: string
}

export interface ICreateGroupInput {
  name: string
  memberIds: number[]
}

export interface IAddMemberInput {
  conversationId: number
  userId: number
}

export interface IGetMessagesParams {
  cursor?: number
  limit?: number
}

export interface ISocketAck<T> {
  event: string
  data: T
}
