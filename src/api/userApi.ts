import { api } from '../lib/utils/axiosConfig'

export const getUsers = async (query: string) => {
  const response = await api.get('/users/search', { params: { q:query } })
  return response.data
}
