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
}
export interface IProfileResponse {
  status: string
  message: string
  data: IProfile
}
export interface IUpdateProfile {
  username: string
  fullname: string
  email: string
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
