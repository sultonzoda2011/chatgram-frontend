import { api } from '../lib/utils/axiosConfig'
import type { IApiResponse } from '../types/chat'
import type { IUser } from '../types/user'

export const searchUsers = async (query: string): Promise<IApiResponse<IUser[]>> => {
  const response = await api.get('/users/search', { params: { q: query } })
  return response.data
}
