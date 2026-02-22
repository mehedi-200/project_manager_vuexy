import { defineStore } from 'pinia';
import {register, login, logout} from '@/api/authApi.ts';

export const authStore = defineStore('authStore',{
  state:()=>({
    isLoggedIn: !!localStorage.getItem('token'),
    token: localStorage.getItem('token') as string | null,
    user: (() => { try { const u = localStorage.getItem('user'); return u ? JSON.parse(u) : null } catch { return null } })() as any,
  }),
  actions:{
    async register(User: any) {
      try {
        const res = await register(User);
        if (!res.data.data) throw new Error(res.data.message || 'Registration failed')
        return res;
      } catch (e) {
        throw e;
      }
    },
    async login(credentials: any) {
      try {
        const res = await login(credentials);
        if (!res.data.data) throw new Error(res.data.message || 'Invalid credentials')
        this.token = res.data.data.token;
        this.user = res.data.data.user;
        this.isLoggedIn = true;
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        return res;
      } catch (e) {
        throw e;
      }
    },
    async logout() {
      try {
        await logout();
      } catch (_) {
        // proceed even if API call fails
      } finally {
        this.token = null;
        this.user = null;
        this.isLoggedIn = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }
})
