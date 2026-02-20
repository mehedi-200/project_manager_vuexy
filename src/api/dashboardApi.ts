import { api } from '@/api/axious.ts'

export const getDashboard = async () => {
  try {
    return await api.get('/admin/dashboard')
  } catch (error) {
    throw error
  }
}
