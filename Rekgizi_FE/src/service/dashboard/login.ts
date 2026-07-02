import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export const loginService = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/api/v1/login`, {
    email,
    password
  })

  return res.data.data
}