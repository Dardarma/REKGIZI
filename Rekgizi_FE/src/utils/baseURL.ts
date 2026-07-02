import axios from 'axios'
import Cookies from 'js-cookie'
import router from '@/router'

export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export const ImageUrl = (path: string) => {
  return `${import.meta.env.VITE_API_URL}${path}`
}

authApi.interceptors.request.use((config) => {
  const token = Cookies.get('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

authApi.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token')
      localStorage.removeItem('role')
      localStorage.removeItem('id')
      localStorage.removeItem('name')

      router.push('/login')
    }

    return Promise.reject(error)
  },
)
