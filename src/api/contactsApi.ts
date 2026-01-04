import { api } from '../lib/utils/axiosConfig'
import type { Contact } from '../types/contacts'

export const getContacts = async (): Promise<Contact[]> => {
  try {
    const response = await api.get('/contacts')
    return response.data.data
  } catch (error) {
    throw error
  }
}
