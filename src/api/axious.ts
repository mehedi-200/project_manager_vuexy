import axios from 'axios'

export const api = axios.create({
  baseURL:import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api',
  headers:{
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials:true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all auth state
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Redirect to login (use window.location to work outside Vue context)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
