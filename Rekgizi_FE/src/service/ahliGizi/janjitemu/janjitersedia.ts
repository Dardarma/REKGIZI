import {authApi} from "@/utils/baseURL"

export const getJadwalTersedia = async() => {
    const res = await authApi.get('/api/v1/jadwal-tersedia/user')
    return res.data
}

export const addJadwalTersedia = async(data: any) => {
    const res = await authApi.post('/api/v1/jadwal-tersedia', data)
    return res
}

export const editJadwalTersedia = async(data: any, id: number) => {
    const res = await authApi.patch(`/api/v1/jadwal-tersedia/${id}`, data)
    return res
}

export const deleteJadwalTersedia = async(id: number) => {
    const res = await authApi.patch(`/api/v1/jadwal-tersedia/delete/${id}`)
    return res.data
}

export const getAllJadwalTersedia = async() => {
    const res = await authApi.get(`/api/v1/jadwal-tersedia`)
    return res.data
}
