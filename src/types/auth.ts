export interface Login {
  username: string
  password: string
}

export interface Register {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface ChangePassword {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface JwtPayload {
  userId: string
  iat: number
  exp: number
}
