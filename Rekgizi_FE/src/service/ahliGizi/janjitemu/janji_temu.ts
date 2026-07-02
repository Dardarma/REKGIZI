import {authApi} from '@/utils/baseURL'

export const addJadwal = async(data: any) => {
    const res = await authApi.post('/api/v1/jadwal/', data)
    return res
}

export const getJanjiTemu = async(search = '', current_page = 1, limit = 10) => {
    const res = await authApi.get('/api/v1/jadwal/', {
        params: {
            search,
            current_page,
            limit,
        },
    })
    return res.data
}

export const getJanjiTemuById = async(id: number) => {
    const res = await authApi.get(`/api/v1/jadwal/${id}`)
    return res.data
}

export const updateStatusJanjiTemu = async(id: number, data: any) => {
    const res = await authApi.patch(`/api/v1/jadwal/status-catatan/${id}` ,data)
    return res.data
}

export const deleteJanjiTemu = async(id: number) => {
    const res = await authApi.delete(`/api/v1/jadwal/${id}`)
    return res.data
}
