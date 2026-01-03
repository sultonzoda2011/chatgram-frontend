import { jwtDecode } from 'jwt-decode'
import { getToken } from './cookie'

export interface JwtPayload {
  userId: string
  iat: number
  exp: number
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token)
  } catch {
    return null
  }
}

export function getJwtFromCookie(): JwtPayload | null {
  const token = getToken()
  if (!token) return null

  return decodeJwt(token)
}
