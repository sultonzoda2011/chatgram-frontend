import { jwtDecode } from 'jwt-decode'
import { getToken } from './cookie'
import type { JwtPayload } from '../../types/auth'

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
