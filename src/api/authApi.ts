import { api } from '../lib/utils/axiosConfig'
import type { ILogin, IRegister } from '../types/auth'

export const loginApi = async (data: ILogin) => {
  try {
    const response = await api.post('/auth/login', data)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const registerApi = async (data: IRegister) => {
  try {
    const response = await api.post('/auth/register', data)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
