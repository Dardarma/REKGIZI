import { authApi } from '@/utils/baseURL'

export const saveNotificationToken = async (token: string) => {
  const res = await authApi.post('/api/v1/notifications/token', {
    token,
    device_type: 'web',
  })

  return res.data
}
