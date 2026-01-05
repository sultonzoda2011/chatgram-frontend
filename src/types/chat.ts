export interface IChats {
  id: number
  username: string
  fullname: string
  avatar: string
  last_message: string
  date: string
}
export interface IChatsResponse {
  status: string
  message: string
  data: IChats[]
}
export interface IMessage {
  id: number
  from_user_id: number
  to_user_id: number
  content: string
  date: string
}
export interface IMessageResponse {
  status: string
  message: string
  data: IMessage[]
}
