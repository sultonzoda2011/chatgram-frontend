import { useMemo } from 'react'
import { getJwtFromCookie } from '../lib/utils/jwt'

export function useCurrentUserId(): number | null {
  return useMemo(() => {
    const payload = getJwtFromCookie()
    return payload ? payload.sub : null
  }, [])
}
