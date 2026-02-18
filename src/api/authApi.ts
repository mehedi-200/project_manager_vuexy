import { api } from '@/api/axious.ts'

export const login = async ()=>{

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
