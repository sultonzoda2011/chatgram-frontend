export interface ILogin {
  email: string
  password: string
}

export interface IRegister {
  username: string
  email: string
  password: string
}



export interface JwtPayload {
  userId: string
  iat: number
  exp: number
}
