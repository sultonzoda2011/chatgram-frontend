import { api } from '../lib/utils/axiosConfig'

export const getContacts = async () => {
  try {
    const response = await api.get('/contacts')
    return response.data.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
