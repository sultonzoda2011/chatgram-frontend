export interface ILogin {
  username: string
  password: string
}

export interface IRegister {
  username: string
  fullname: string
  email: string
  password: string
}
export interface IProfile {
  id: number
  username: string
  fullname: string
  email: string
  avatar: string
}
export interface IUpdateProfile {
  username: string
  fullname: string
  email: string
  avatar: File
}
export interface IChangePassword {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
export interface JwtPayload {
  userId: string
  iat: number
  exp: number
}
