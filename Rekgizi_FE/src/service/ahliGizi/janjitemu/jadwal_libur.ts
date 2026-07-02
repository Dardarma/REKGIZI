import { authApi } from "@/utils/baseURL";

export const getJadwalLibur = async() => {
    const res = await authApi.get('/api/v1/jadwal_libur/')
    return res.data
}

export const deleteJadwalLibur = async(id: number) => {
    const res = await authApi.patch(`/api/v1/jadwal_libur/delete/${id}`)
    return res.data
}

export const createJadwalLibur = async(data: any) => {
    const res = await authApi.post(`/api/v1/jadwal_libur/`, data)
    return res.data
}
