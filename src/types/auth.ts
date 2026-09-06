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
  avatarUrl?: string | null
  isOnline?: boolean
  lastSeenAt?: string | null
}

export interface IProfileResponse {
  status: string
  message: string
  data: IProfile
}

export interface IAuthResponse {
  status: string
  message: string
  data: { token: string }
}

export interface IUpdateProfile {
  username: string
  fullname: string
  email: string
  avatarUrl?: string
}

export interface IChangePassword {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface JwtPayload {
  sub: number
  username: string
  iat: number
  exp: number
}
