export interface IUsers {
  status: string
  message: string
  data: IUser[]
}

export interface IUser {
  id: number
  username: string
  fullname: string
  avatar: string
}
