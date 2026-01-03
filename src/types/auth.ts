export interface ILogin {
  username: string
  password: string
}

export interface IRegister {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface IChangePassword {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}
