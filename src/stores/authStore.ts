import { defineStore } from 'pinia';
import {register} from '@/api/authApi.ts';

export const authStore = defineStore('authStore',{
  state:()=>({
    isLoggedIn:false,
  }),
  actions:{
    register(User:any){
      try
      {
       return register(User);
      }
      catch (e)
      {
        throw e;
      }
    }
  }
})
