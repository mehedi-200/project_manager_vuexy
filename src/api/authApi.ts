import { api } from '@/api/axious.ts'

export const login = async (credentials: any) => {
  try {
    return await api.post('/login', credentials);
  } catch (error) {
    throw error;
  }
}
export const register = async (User:any)=>{
  try
  {
    return await api.post('/register',User);
  }
  catch(error)
  {
    throw error;
  }
}
export const logout = async () => {
  try {
    return await api.post('/logout');
  } catch (error) {
    throw error;
  }
}
