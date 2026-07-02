import { publicApi } from '@/utils/baseURL'

export const registerService = async (data: any) => {
  const res = await publicApi.post('/api/v1/register', data)
  return res.data.data
}
